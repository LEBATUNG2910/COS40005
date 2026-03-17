import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import {
  CandidateCv,
  CandidateCvDocument,
  BatchAnalysis,
  BatchAnalysisDocument,
  DuplicatePair,
  DuplicatePairDocument,
} from '../database/schemas/candidate-cv.schema';
import { CvService } from '../cv/cv.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class CvBatchService {
  constructor(
    @InjectModel(CandidateCv.name)
    private candidateCvModel: Model<CandidateCvDocument>,
    @InjectModel(BatchAnalysis.name)
    private batchAnalysisModel: Model<BatchAnalysisDocument>,
    @InjectModel(DuplicatePair.name)
    private duplicatePairModel: Model<DuplicatePairDocument>,
    private readonly cvService: CvService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ─── Upload nhiều CV cùng lúc ─────────────────────────────────
  async uploadBatch(
    userId: string,
    files: Express.Multer.File[],
  ): Promise<{ uploaded: number; duplicates: number; results: any[] }> {
    const results: any[] = [];
    let duplicateCount = 0;

    // Lấy tất cả hash hiện có của user để so sánh nhanh
    const existingCVs = await this.candidateCvModel
      .find({ uploadedBy: userId })
      .select('_id textHash originalFileName')
      .lean();
    const existingHashes = new Map(existingCVs.map((cv) => [cv.textHash, cv]));

    for (const file of files) {
      try {
        // 1. Extract text từ PDF
        const { text, pageCount, method } =
          await this.cvService.extractTextFromPDF(file.path);

        // 2. Tạo hash để detect duplicate
        const textHash = this.hashText(text);

        // 3. Upload lên Cloudinary
        let cloudinaryPublicId: string | null = null;
        let cloudinaryUrl: string | null = null;
        try {
          const uploaded = await this.cloudinaryService.uploadPDF(
            file.path,
            `batch/${userId}`,
          );
          cloudinaryPublicId = uploaded.publicId;
          cloudinaryUrl = uploaded.secureUrl;
        } catch {
          /* Cloudinary fail không block */
        }

        // 4. Check exact duplicate (same hash)
        const exactDup = existingHashes.get(textHash);
        if (exactDup) {
          duplicateCount++;
          results.push({
            fileName: file.originalname,
            status: 'duplicate',
            duplicateOf: exactDup.originalFileName,
            duplicateType: 'exact',
            similarity: 1.0,
          });
          continue;
        }

        // 5. Extract candidate name từ text (dòng đầu thường là tên)
        const candidateName = this.extractCandidateName(text);

        // 6. Tính skill vector để detect near-duplicate sau
        const skillVector = this.buildSkillVector(text);

        // 7. Lưu vào DB
        const cvId = uuidv4();
        await this.candidateCvModel.create({
          _id: cvId,
          uploadedBy: userId,
          candidateName,
          originalFileName: file.originalname,
          localFilePath: file.path,
          cloudinaryPublicId,
          cloudinaryUrl,
          fileSize: file.size,
          extractedText: text,
          extractionMethod: method,
          pageCount,
          textHash,
          skillVector: JSON.stringify(skillVector),
          uploadedAt: new Date(),
        });

        // 8. Check near-duplicate (cosine similarity với các CV hiện có)
        const nearDups = await this.detectNearDuplicates(
          userId,
          cvId,
          skillVector,
          existingCVs,
        );
        if (nearDups.length > 0) duplicateCount++;

        // Update existingHashes để check các file tiếp theo trong cùng batch
        existingHashes.set(textHash, {
          _id: cvId,
          textHash,
          originalFileName: file.originalname,
        } as any);

        results.push({
          fileName: file.originalname,
          candidateName,
          cvId,
          status: nearDups.length > 0 ? 'near_duplicate' : 'uploaded',
          nearDuplicates: nearDups,
        });
      } catch (err) {
        results.push({
          fileName: file.originalname,
          status: 'error',
          error: err.message,
        });
      }
    }

    return {
      uploaded: results.filter(
        (r) => r.status === 'uploaded' || r.status === 'near_duplicate',
      ).length,
      duplicates: duplicateCount,
      results,
    };
  }

  // ─── Rank tất cả CV của user theo JD ──────────────────────────
  async rankCVs(
    userId: string,
    jobDescription: string,
    topN: number = 10,
  ): Promise<{
    rankings: any[];
    jdHash: string;
    total: number;
    duplicateWarnings: any[];
  }> {
    const jdHash = this.hashText(jobDescription);

    // Lấy tất cả CV của user
    const allCVs = await this.candidateCvModel
      .find({ uploadedBy: userId })
      .lean();
    if (allCVs.length === 0)
      throw new NotFoundException(
        'No candidate CVs found. Please upload CVs first.',
      );

    // Check cache — CV nào đã score với JD này rồi thì lấy luôn
    const cachedScores = await this.batchAnalysisModel
      .find({ uploadedBy: userId, jdHash })
      .lean();
    const cachedMap = new Map(cachedScores.map((s) => [s.candidateCvId, s]));

    // Score song song (Promise.all) cho các CV chưa có cache
    const toScore = allCVs.filter((cv) => !cachedMap.has(cv._id));
    const newScores = await Promise.all(
      toScore.map((cv) => this.scoreOneCv(userId, cv, jobDescription, jdHash)),
    );

    // Lưu scores mới vào DB
    if (newScores.length > 0) {
      await this.batchAnalysisModel
        .insertMany(newScores.filter(Boolean), { ordered: false })
        .catch(() => {});
    }

    // Merge cached + new
    const allScores = [...cachedScores, ...newScores.filter(Boolean)];

    // Sort by score desc
    allScores.sort((a, b) => b.matchScore - a.matchScore);

    // Build ranking list
    const cvMap = new Map(allCVs.map((cv) => [cv._id, cv]));
    const rankings = allScores.slice(0, topN).map((score, idx) => {
      const cv = cvMap.get(score.candidateCvId);
      return {
        rank: idx + 1,
        cvId: score.candidateCvId,
        candidateName: cv?.candidateName ?? cv?.originalFileName ?? 'Unknown',
        fileName: cv?.originalFileName,
        matchScore: score.matchScore,
        bm25Score: score.bm25Score,
        skillMatchRatio: score.skillMatchRatio,
        cvSkills: score.cvSkills,
        missingSkills: score.missingSkills,
        overallFeedback: score.overallFeedback,
        analyzedAt: score.analyzedAt,
      };
    });

    // Lấy duplicate warnings
    const duplicateWarnings = await this.duplicatePairModel
      .find({ uploadedBy: userId })
      .lean();

    return { rankings, jdHash, total: allCVs.length, duplicateWarnings };
  }

  // ─── So sánh chi tiết 2 CV ────────────────────────────────────
  async compareTwoCVs(
    userId: string,
    cvIdA: string,
    cvIdB: string,
    jobDescription: string,
  ): Promise<any> {
    const [cvA, cvB] = await Promise.all([
      this.candidateCvModel.findOne({ _id: cvIdA, uploadedBy: userId }).lean(),
      this.candidateCvModel.findOne({ _id: cvIdB, uploadedBy: userId }).lean(),
    ]);

    if (!cvA) throw new NotFoundException(`CV A (${cvIdA}) not found`);
    if (!cvB) throw new NotFoundException(`CV B (${cvIdB}) not found`);

    const jdHash = this.hashText(jobDescription);

    // Lấy hoặc tạo scores cho cả 2
    const [scoreA, scoreB] = await Promise.all([
      this.getOrCreateScore(userId, cvA, jobDescription, jdHash),
      this.getOrCreateScore(userId, cvB, jobDescription, jdHash),
    ]);

    // Skills analysis
    const skillsA = new Set(scoreA.cvSkills ?? []);
    const skillsB = new Set(scoreB.cvSkills ?? []);
    const commonSkills = [...skillsA].filter((s) => skillsB.has(s));
    const uniqueToA = [...skillsA].filter((s) => !skillsB.has(s));
    const uniqueToB = [...skillsB].filter((s) => !skillsA.has(s));

    // Check duplicate giữa 2 CV này
    const dupPair = await this.duplicatePairModel
      .findOne({
        $or: [
          { cvIdA, cvIdB },
          { cvIdA: cvIdB, cvIdB: cvIdA },
        ],
      })
      .lean();

    // Similarity score giữa 2 CV
    const similarity =
      cvA.textHash === cvB.textHash
        ? 1.0
        : this.cosineSimilarity(
            JSON.parse(cvA.skillVector ?? '{}'),
            JSON.parse(cvB.skillVector ?? '{}'),
          );

    const winner = scoreA.matchScore >= scoreB.matchScore ? 'A' : 'B';
    const scoreDiff = Math.abs(scoreA.matchScore - scoreB.matchScore);

    return {
      jobDescription,
      duplicate: dupPair
        ? { type: dupPair.duplicateType, similarity: dupPair.similarity }
        : null,
      cvSimilarity: Math.round(similarity * 100),
      winner,
      scoreDiff,
      cvA: {
        cvId: cvIdA,
        candidateName: cvA.candidateName ?? cvA.originalFileName,
        fileName: cvA.originalFileName,
        matchScore: scoreA.matchScore,
        bm25Score: scoreA.bm25Score,
        skillMatchRatio: scoreA.skillMatchRatio,
        cvSkills: scoreA.cvSkills,
        missingSkills: scoreA.missingSkills,
        overallFeedback: scoreA.overallFeedback,
      },
      cvB: {
        cvId: cvIdB,
        candidateName: cvB.candidateName ?? cvB.originalFileName,
        fileName: cvB.originalFileName,
        matchScore: scoreB.matchScore,
        bm25Score: scoreB.bm25Score,
        skillMatchRatio: scoreB.skillMatchRatio,
        cvSkills: scoreB.cvSkills,
        missingSkills: scoreB.missingSkills,
        overallFeedback: scoreB.overallFeedback,
      },
      skillsComparison: { commonSkills, uniqueToA, uniqueToB },
    };
  }

  // ─── Lấy danh sách CV của user ────────────────────────────────
  async listCVs(userId: string): Promise<any[]> {
    const cvs = await this.candidateCvModel
      .find({ uploadedBy: userId })
      .sort({ uploadedAt: -1 })
      .select('-extractedText -skillVector')
      .lean();

    // Lấy duplicate info
    const dups = await this.duplicatePairModel
      .find({ uploadedBy: userId })
      .lean();
    const dupSet = new Set([
      ...dups.map((d) => d.cvIdA),
      ...dups.map((d) => d.cvIdB),
    ]);

    return cvs.map((cv) => ({
      cvId: cv._id,
      candidateName: cv.candidateName ?? cv.originalFileName,
      fileName: cv.originalFileName,
      fileSize: cv.fileSize,
      uploadedAt: cv.uploadedAt,
      isDuplicate: dupSet.has(cv._id as string),
    }));
  }

  // ─── Xóa CV ứng viên ─────────────────────────────────────────
  async deleteCandidateCv(userId: string, cvId: string): Promise<void> {
    const cv = await this.candidateCvModel.findOne({
      _id: cvId,
      uploadedBy: userId,
    });
    if (!cv) throw new NotFoundException('CV not found');
    await Promise.all([
      this.candidateCvModel.deleteOne({ _id: cvId }),
      this.batchAnalysisModel.deleteMany({ candidateCvId: cvId }),
      this.duplicatePairModel.deleteMany({
        $or: [{ cvIdA: cvId }, { cvIdB: cvId }],
      }),
    ]);
    if (cv.cloudinaryPublicId) {
      await this.cloudinaryService
        .deletePDF(cv.cloudinaryPublicId)
        .catch(() => {});
    }
  }

  // ─── Private helpers ──────────────────────────────────────────

  private async scoreOneCv(
    userId: string,
    cv: any,
    jobDescription: string,
    jdHash: string,
  ): Promise<any> {
    try {
      if (!cv.extractedText) return null;
      const scoreBreakdown = (this.cvService as any).calculateBM25Score(
        cv.extractedText,
        jobDescription,
      );
      const jdSkills = (this.cvService as any).extractSkills(jobDescription);
      const cvSkills = (this.cvService as any).extractSkills(cv.extractedText);
      const missingSkills = jdSkills.filter(
        (s: string) => !cvSkills.includes(s),
      );
      const matchScore = Math.min(Math.round(scoreBreakdown.total * 100), 99);

      // Gọi Gemini cho overallFeedback (optional — chỉ lấy feedback ngắn)
      let overallFeedback: string | null = null;
      try {
        const ai = await this.callGeminiFeedback(
          cv.extractedText,
          jobDescription,
        );
        overallFeedback = ai;
      } catch {
        /* không block nếu Gemini fail */
      }

      return {
        _id: uuidv4(),
        candidateCvId: cv._id,
        uploadedBy: userId,
        jdHash,
        jobDescription,
        matchScore,
        bm25Score: scoreBreakdown.bm25,
        skillMatchRatio: scoreBreakdown.skillMatch,
        depthScore: scoreBreakdown.depth,
        cvSkills,
        missingSkills,
        overallFeedback,
        analyzedAt: new Date(),
      };
    } catch (err) {
      console.error(`Score failed for CV ${cv._id}:`, err.message);
      return null;
    }
  }

  private async getOrCreateScore(
    userId: string,
    cv: any,
    jobDescription: string,
    jdHash: string,
  ): Promise<any> {
    const cached = await this.batchAnalysisModel
      .findOne({ candidateCvId: cv._id, jdHash })
      .lean();
    if (cached) return cached;
    const score = await this.scoreOneCv(userId, cv, jobDescription, jdHash);
    if (score) {
      await this.batchAnalysisModel.create(score).catch(() => {});
      return score;
    }
    return {
      matchScore: 0,
      cvSkills: [],
      missingSkills: [],
      overallFeedback: null,
    };
  }

  private async detectNearDuplicates(
    userId: string,
    newCvId: string,
    newVector: Record<string, number>,
    existingCVs: any[],
  ): Promise<any[]> {
    const nearDups: any[] = [];
    for (const existing of existingCVs) {
      if (!existing.skillVector) continue;
      try {
        const existingVector = JSON.parse(existing.skillVector);
        const sim = this.cosineSimilarity(newVector, existingVector);
        if (sim >= 0.9) {
          const pairId = [newCvId, existing._id].sort().join('_');
          await this.duplicatePairModel.updateOne(
            {
              cvIdA: [newCvId, existing._id].sort()[0],
              cvIdB: [newCvId, existing._id].sort()[1],
            },
            {
              $setOnInsert: {
                _id: uuidv4(),
                uploadedBy: userId,
                cvIdA: [newCvId, existing._id].sort()[0],
                cvIdB: [newCvId, existing._id].sort()[1],
                similarity: sim,
                duplicateType: 'near',
                detectedAt: new Date(),
              },
            },
            { upsert: true },
          );
          nearDups.push({
            cvId: existing._id,
            fileName: existing.originalFileName,
            similarity: Math.round(sim * 100),
          });
        }
      } catch {
        continue;
      }
    }
    return nearDups;
  }

  // ─── Hash text (SHA256, 16 chars prefix) ────────────────────
  private hashText(text: string): string {
    return createHash('sha256')
      .update(text.trim().toLowerCase())
      .digest('hex')
      .substring(0, 32);
  }

  // ─── Build skill vector {skill: count} ──────────────────────
  private buildSkillVector(text: string): Record<string, number> {
    const skills = (this.cvService as any).extractSkills(text);
    const vector: Record<string, number> = {};
    const lower = text.toLowerCase();
    for (const skill of skills) {
      const count = (lower.match(new RegExp(skill, 'gi')) ?? []).length;
      vector[skill] = count;
    }
    return vector;
  }

  // ─── Cosine similarity giữa 2 skill vectors ─────────────────
  private cosineSimilarity(
    a: Record<string, number>,
    b: Record<string, number>,
  ): number {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    let dot = 0,
      normA = 0,
      normB = 0;
    for (const k of keys) {
      const va = a[k] ?? 0,
        vb = b[k] ?? 0;
      dot += va * vb;
      normA += va * va;
      normB += vb * vb;
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // ─── Extract candidate name từ đầu CV text ──────────────────
  private extractCandidateName(text: string): string | null {
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    // Thường dòng đầu là tên — check không phải email/phone/URL
    for (const line of lines.slice(0, 5)) {
      if (line.length < 3 || line.length > 60) continue;
      if (/[@\/\d{4}]/.test(line)) continue;
      if (/^(curriculum|resume|cv|profile)/i.test(line)) continue;
      return line;
    }
    return null;
  }

  // ─── Gọi Gemini lấy 1 câu overall feedback ngắn ────────────
  private async callGeminiFeedback(
    cvText: string,
    jd: string,
  ): Promise<string | null> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `In 1-2 sentences, assess how well this CV matches the job description.\n\nCV:\n${cvText.substring(0, 1500)}\n\nJD:\n${jd.substring(0, 800)}\n\nRespond with ONLY the assessment sentence, no preamble.`,
                },
              ],
            },
          ],
          generationConfig: { temperature: 0.1, maxOutputTokens: 150 },
        }),
      },
    );
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null;
  }
}
