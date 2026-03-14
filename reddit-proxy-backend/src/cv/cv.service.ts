import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import { execSync } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import { CvUpload, CvUploadDocument } from '../database/schemas/cv-upload.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CvAnalysis, CvAnalysisDocument, AiInsight, AiInsightDocument, AiSuggestion, AiSuggestionDocument, LearningResource, LearningResourceDocument } from '../database/schemas/cv-analysis.schema';

type ExtractionMethod = 'pdftotext' | 'pdf-parse' | 'gemini-vision';

@Injectable()
export class CvService {
  private tempTextStore = new Map<string, string>();

  constructor(
    @InjectModel(CvUpload.name)       private cvUploadModel: Model<CvUploadDocument>,
    @InjectModel(CvAnalysis.name)     private analysisModel: Model<CvAnalysisDocument>,
    @InjectModel(AiInsight.name)      private insightModel: Model<AiInsightDocument>,
    @InjectModel(AiSuggestion.name)   private suggestionModel: Model<AiSuggestionDocument>,
    @InjectModel(LearningResource.name) private resourceModel: Model<LearningResourceDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async extractTextFromPDF(filePath: string): Promise<{ text: string; pageCount: number; method: ExtractionMethod }> {
    const possiblePaths = [
      '/opt/homebrew/bin/pdftotext',
      '/usr/local/bin/pdftotext',
      'pdftotext',
      '/usr/bin/pdftotext',
    ];

    let pdfToTextPath = '';
    for (const p of possiblePaths) {
      try { execSync(`"${p}" -v 2>&1`, { encoding: 'utf8' }); pdfToTextPath = p; break; }
      catch { continue; }
    }

    if (pdfToTextPath) {
      try {
        const text = execSync(`"${pdfToTextPath}" -layout "${filePath}" -`, {
          encoding: 'utf8', maxBuffer: 10 * 1024 * 1024,
          env: { ...process.env, PATH: '/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin' },
        });
        let pageCount = 1;
        try {
          const info = execSync(`"${pdfToTextPath.replace('pdftotext', 'pdfinfo')}" "${filePath}"`, { encoding: 'utf8' });
          const match = info.match(/Pages:\s+(\d+)/);
          if (match) pageCount = parseInt(match[1]);
        } catch { pageCount = 1; }
        if (text.trim().length > 30) return { text: text.trim(), pageCount, method: 'pdftotext' };
      } catch (e) { console.error('pdftotext failed:', e); }
    }

    try {
      const pdfParseLib = require('pdf-parse');
      const pdfParse = pdfParseLib.default ?? pdfParseLib;
      const buffer = fs.readFileSync(filePath);
      const data = await pdfParse(buffer);
      if (data.text && data.text.trim().length > 30)
        return { text: data.text, pageCount: data.numpages, method: 'pdf-parse' };
    } catch { console.warn('pdf-parse failed, trying Gemini Vision...'); }

    const visionText = await this.extractWithGeminiVision(filePath);
    if (visionText && visionText.length > 30) return { text: visionText, pageCount: 1, method: 'gemini-vision' };

    throw new BadRequestException('Cannot extract CV content. The file may be corrupted or empty.');
  }

  async saveCV(userId: string, file: Express.Multer.File, templateId: number): Promise<any> {
    const { text, pageCount, method } = await this.extractTextFromPDF(file.path);

    // Upload lên Cloudinary
    const uploaded = await this.cloudinaryService.uploadPDF(file.path, userId);

    // KHÔNG xóa file local — dùng để serve preview trực tiếp
    // this.cloudinaryService.deleteLocalFile(file.path); // uncomment nếu muốn xóa

    // Đánh dấu CV cũ không còn là latest
    await this.cvUploadModel.updateMany({ userId, isLatest: true }, { $set: { isLatest: false } });

    const cv = new this.cvUploadModel({
      _id: uuidv4(),
      userId,
      originalFileName: file.originalname,
      fileSize: uploaded.bytes,
      mimeType: file.mimetype,
      storedFilePath: uploaded.secureUrl,     // ← Cloudinary URL (backup)
      localFilePath: file.path,               // ← local path để serve preview
      cloudinaryPublicId: uploaded.publicId,  // ← lưu để xóa sau này
      extractedText: text,
      extractionMethod: method,
      pageCount,
      templateId: String(templateId),
      isLatest: true,
      uploadedAt: new Date(),
    });

    await cv.save();
    return cv;
  }

  async getCVByUser(userId: string): Promise<any | null> {
    return this.cvUploadModel.findOne({ userId, isLatest: true });
  }

  async updateCVText(userId: string, extractedText: string): Promise<void> {
    const cv = await this.getCVByUser(userId);
    if (!cv) throw new NotFoundException('No CV found. Please upload your CV first.');
    this.tempTextStore.set(userId, extractedText);
  }

  async analyzeCV(userId: string, jobDescription: string): Promise<any> {
    const cv = await this.getCVByUser(userId);
    if (!cv) throw new NotFoundException('No CV found. Please upload your CV first.');

    const isTemporary = this.tempTextStore.has(userId);
    const textToAnalyze = this.tempTextStore.get(userId) ?? cv.extractedText;
    if (isTemporary) this.tempTextStore.delete(userId);

    const scoreBreakdown = this.calculateBM25Score(textToAnalyze, jobDescription);
    const jdSkills = this.extractSkills(jobDescription);
    const cvSkills = this.extractSkills(textToAnalyze);
    const missingSkills = jdSkills.filter(s => !cvSkills.includes(s));
    const aiAnalysis = await this.callGeminiAI(textToAnalyze, jobDescription, missingSkills);

    const matchScore = Math.min(Math.round(scoreBreakdown.total * 100), 99);

    // ── Lưu kết quả vào MongoDB ─────────────────────────────────
    await this.saveAnalysisToDb({
      userId,
      cvUploadId: cv._id,
      jobDescription,
      matchScore,
      scoreBreakdown,
      cvSkills,
      jdSkills,
      missingSkills,
      aiAnalysis,
    });

    return {
      fileName: cv.originalFileName,
      pageCount: cv.pageCount,
      templateId: cv.templateId,
      uploadedAt: cv.uploadedAt,
      extractionMethod: cv.extractionMethod,
      preview: textToAnalyze.substring(0, 400).trim(),
      matchScore,
      scoreBreakdown: {
        bm25:       Math.round(scoreBreakdown.bm25 * 100),
        skillMatch: Math.round(scoreBreakdown.skillMatch * 100),
        depth:      Math.round(scoreBreakdown.depth * 100),
      },
      isTemporary,
      cvSkills,
      jdSkills,
      missingSkills,
      aiAnalysis,
    };
  }

  // ── Lấy lịch sử analyze của user ─────────────────────────────
  async getAnalysisHistory(userId: string): Promise<any[]> {
    const analyses = await this.analysisModel
      .find({ userId })
      .sort({ analyzedAt: -1 })
      .limit(20)
      .lean();

    return Promise.all(analyses.map(async (a) => {
      const insights = await this.insightModel.find({ analysisId: a._id }).lean();
      const suggestions = await this.suggestionModel.find({ analysisId: a._id }).sort({ sortOrder: 1 }).lean();

      const suggestionsWithResources = await Promise.all(
        suggestions.map(async (s) => {
          const resources = await this.resourceModel.find({ suggestionId: s._id }).sort({ sortOrder: 1 }).lean();
          return {
            skill: s.skillName,
            reason: s.reason,
            resources: resources.map(r => ({ name: r.name, url: r.url, type: r.resourceType, platform: r.platform })),
          };
        })
      );

      return {
        id: a._id,
        analyzedAt: a.analyzedAt,
        matchScore: a.matchScore,
        jobDescriptionPreview: a.jobDescription.substring(0, 150) + (a.jobDescription.length > 150 ? '...' : ''),
        overallFeedback: a.overallFeedback,
        scoreBreakdown: {
          bm25:       Math.round((a.bm25RawScore ?? 0) * 100),
          skillMatch: Math.round((a.skillMatchRatio ?? 0) * 100),
        },
        strengths:  insights.filter(i => i.insightType === 'STRENGTH').map(i => i.content),
        weaknesses: insights.filter(i => i.insightType === 'WEAKNESS').map(i => i.content),
        suggestions: suggestionsWithResources,
      };
    }));
  }

  // ── Lưu analysis + insights + suggestions + resources vào DB ──
  private async saveAnalysisToDb(data: {
    userId: string; cvUploadId: string; jobDescription: string;
    matchScore: number; scoreBreakdown: any;
    cvSkills: string[]; jdSkills: string[]; missingSkills: string[];
    aiAnalysis: any;
  }): Promise<void> {
    try {
      const analysisId = uuidv4();

      // 1. Save CvAnalysis
      await this.analysisModel.create({
        _id: analysisId,
        userId: data.userId,
        cvUploadId: data.cvUploadId,
        jobDescription: data.jobDescription,
        matchScore: data.matchScore,
        bm25RawScore: data.scoreBreakdown.bm25,
        skillMatchRatio: data.scoreBreakdown.skillMatch,
        overallFeedback: data.aiAnalysis?.overallFeedback ?? null,
        analyzedAt: new Date(),
      });

      // 2. Save AI Insights (strengths + weaknesses)
      const insights = [
        ...(data.aiAnalysis?.strengths ?? []).map((content: string, i: number) => ({
          _id: uuidv4(), analysisId, insightType: 'STRENGTH', content, sortOrder: i,
        })),
        ...(data.aiAnalysis?.weaknesses ?? []).map((content: string, i: number) => ({
          _id: uuidv4(), analysisId, insightType: 'WEAKNESS', content, sortOrder: i,
        })),
      ];
      if (insights.length > 0) await this.insightModel.insertMany(insights);

      // 3. Save Suggestions + Learning Resources
      for (let i = 0; i < (data.aiAnalysis?.suggestions ?? []).length; i++) {
        const s = data.aiAnalysis.suggestions[i];
        const suggestionId = uuidv4();

        await this.suggestionModel.create({
          _id: suggestionId,
          analysisId,
          skillName: s.skill,
          reason: s.reason,
          sortOrder: i,
        });

        const resources = (s.resources ?? []).map((r: any, j: number) => ({
          _id: uuidv4(),
          suggestionId,
          name: r.name,
          url: r.url,
          resourceType: ['free','paid'].includes(r.type) ? r.type : 'free',
          platform: ['Roadmap.sh','FreeCodeCamp','Udemy','YouTube'].includes(r.platform) ? r.platform : 'Other',
          sortOrder: j,
        }));
        if (resources.length > 0) await this.resourceModel.insertMany(resources);
      }
    } catch (err) {
      // Không throw — lỗi lưu history không nên block kết quả analyze trả về user
      console.error('Failed to save analysis to DB:', err);
    }
  }

  private calculateBM25Score(cvText: string, jdText: string): { total: number; bm25: number; skillMatch: number; depth: number } {
    const k1 = 1.5, b = 0.75;
    const stopWords = new Set(['the','and','for','are','but','not','you','all','can','her','was','one','our','out','day','get','has','him','his','how','its','may','new','now','old','see','two','way','who','boy','did','does','let','put','say','she','too','use','with','that','this','have','from','they','will','been','into','more','also','what','than','then','when','your','each','able','work','well']);
    const tokenize = (text: string) => text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(t => t.length > 2 && !stopWords.has(t));

    const cvTokens = tokenize(cvText);
    const jdTokens = tokenize(jdText);
    const tf = new Map<string, number>();
    cvTokens.forEach(t => tf.set(t, (tf.get(t) || 0) + 1));
    const avgdl = cvTokens.length || 1;

    let score = 0;
    const uniqueJdTerms = [...new Set(jdTokens)];
    uniqueJdTerms.forEach(term => {
      const f = tf.get(term) || 0;
      if (f > 0) score += (f * (k1 + 1)) / (f + k1 * (1 - b + b * (cvTokens.length / avgdl)));
    });

    const jdSkills = this.extractSkills(jdText);
    const cvSkills = this.extractSkills(cvText);
    const skillMatchRatio = jdSkills.length > 0 ? cvSkills.filter(s => jdSkills.includes(s)).length / jdSkills.length : 0;
    const bm25Score = uniqueJdTerms.length === 0 ? 0 : Math.min(score / (uniqueJdTerms.length * (k1 + 1)), 1);

    const cvLower = cvText.toLowerCase();
    const depthScore = jdSkills.length > 0
      ? jdSkills.reduce((acc, skill) => {
          let count = 0, pos = cvLower.indexOf(skill);
          while (pos !== -1) { count++; pos = cvLower.indexOf(skill, pos + 1); }
          return acc + Math.min(count / 3, 1);
        }, 0) / jdSkills.length
      : 0;

    const combined = bm25Score * 0.30 + skillMatchRatio * 0.50 + depthScore * 0.20;
    const bonus = skillMatchRatio >= 0.8 ? (skillMatchRatio - 0.8) * 0.5 : 0;
    return { total: Math.min(combined + bonus, 1), bm25: bm25Score, skillMatch: skillMatchRatio, depth: depthScore };
  }

  private extractSkills(text: string): string[] {
    const skills = [
      'javascript','typescript','python','java','c++','c#','go','rust','php','ruby','swift','kotlin','scala',
      'react','vue','angular','nextjs','html','css','tailwind','sass','redux','graphql','webpack','vite',
      'nodejs','nestjs','express','django','spring','fastapi','laravel','flask',
      'postgresql','mysql','mongodb','redis','elasticsearch','sqlite','firebase',
      'docker','kubernetes','aws','gcp','azure','terraform','ansible','jenkins','github actions',
      'git','linux','rest api','microservices','agile','scrum',
      'machine learning','deep learning','tensorflow','pytorch','pandas','numpy',
      'figma','jira','postman','jest','cypress','swagger','fullstack','full-stack','restful','api documentation',
      'oop','solid','design pattern','rabbitmq','kafka','apollo','serverless','lambda','cloud functions','ci/cd',
      'continuous integration','continuous deployment',
    ];
    const lower = text.toLowerCase();
    return [...new Set(skills.filter(s => lower.includes(s)))];
  }

  private async callGeminiAI(cvText: string, jdText: string, missingSkills: string[]): Promise<any> {
    const missingText = missingSkills.length > 0 ? missingSkills.join(', ') : 'No keyword-based missing skills detected, but analyze the CV depth and suggest improvements anyway';
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const prompt = `[Request ID: ${id}] You are an expert career coach and senior technical recruiter with 15+ years experience.

CV TEXT (first 3000 chars):
${cvText.substring(0, 3000)}

JOB DESCRIPTION:
${jdText.substring(0, 2000)}

MISSING SKILLS: ${missingText}

Respond ONLY with valid JSON (no markdown, no backticks):
{"strengths":["...","...","..."],"weaknesses":["...","..."],"suggestions":[{"skill":"...","reason":"...","resources":[{"name":"...","url":"https://roadmap.sh/...","type":"free","platform":"Roadmap.sh"},{"name":"...","url":"https://www.freecodecamp.org/...","type":"free","platform":"FreeCodeCamp"},{"name":"...","url":"https://www.udemy.com/course/...","type":"paid","platform":"Udemy"}]},{"skill":"...","reason":"...","resources":[...]},{"skill":"...","reason":"...","resources":[...]}],"overallFeedback":"..."}

Rules: ALWAYS exactly 3 suggestions. Use real URLs. Be specific to this CV.`;

    const fetchGemini = async (left: number): Promise<string | null> => {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.85, topP: 0.95, topK: 40, maxOutputTokens: 3000 } }) }
        );
        const data = await res.json();
        if (data?.error?.code === 503 && left > 1) { await new Promise(r => setTimeout(r, 2000)); return fetchGemini(left - 1); }
        return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
      } catch { if (left > 1) { await new Promise(r => setTimeout(r, 2000)); return fetchGemini(left - 1); } return null; }
    };

    try {
      const raw = await fetchGemini(3);
      if (!raw) throw new Error('Gemini unavailable');
      let cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const s = cleaned.indexOf('{'), e = cleaned.lastIndexOf('}');
      if (s !== -1 && e !== -1) cleaned = cleaned.substring(s, e + 1);
      const parsed = JSON.parse(cleaned);
      if (!parsed.suggestions?.length) parsed.suggestions = this.buildFallbackSuggestions(missingSkills);
      return parsed;
    } catch {
      return {
        strengths: ['CV shows relevant experience','Technical skills align with requirements','Educational background supports this role'],
        weaknesses: ['Could not complete detailed AI analysis — please retry','Some JD skills may need stronger evidence in CV'],
        suggestions: this.buildFallbackSuggestions(missingSkills),
        overallFeedback: 'Basic keyword analysis completed. Please retry for detailed AI-powered insights.',
      };
    }
  }

  private async extractWithGeminiVision(filePath: string): Promise<string | null> {
    try {
      const base64 = fs.readFileSync(filePath).toString('base64');
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [
            { inlineData: { mimeType: 'application/pdf', data: base64 } },
            { text: 'Extract ALL text from this CV. Return raw text in reading order. No commentary.' }
          ]}], generationConfig: { temperature: 0.1, maxOutputTokens: 4000 } }) }
      );
      const data = await res.json();
      if (data?.error) { console.error('Gemini Vision error:', data.error.message); return null; }
      const extracted = data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
      if (extracted) console.log(`✅ Gemini Vision extracted ${extracted.length} chars`);
      return extracted;
    } catch (err) { console.error('Gemini Vision failed:', err); return null; }
  }

  private buildFallbackSuggestions(missingSkills: string[]): any[] {
    const map: Record<string, any[]> = {
      docker: [{name:'Docker Roadmap',url:'https://roadmap.sh/docker',type:'free',platform:'Roadmap.sh'},{name:'Docker for Beginners',url:'https://www.freecodecamp.org/news/docker-simplified/',type:'free',platform:'FreeCodeCamp'},{name:'Docker & Kubernetes Guide',url:'https://www.udemy.com/course/docker-kubernetes-the-practical-guide/',type:'paid',platform:'Udemy'}],
      kubernetes: [{name:'Kubernetes Roadmap',url:'https://roadmap.sh/kubernetes',type:'free',platform:'Roadmap.sh'},{name:'Kubernetes Handbook',url:'https://www.freecodecamp.org/news/the-kubernetes-handbook/',type:'free',platform:'FreeCodeCamp'},{name:'Kubernetes for Beginners',url:'https://www.udemy.com/course/learn-kubernetes/',type:'paid',platform:'Udemy'}],
      typescript: [{name:'TypeScript Roadmap',url:'https://roadmap.sh/typescript',type:'free',platform:'Roadmap.sh'},{name:'TypeScript Guide',url:'https://www.freecodecamp.org/news/learn-typescript-beginners-guide/',type:'free',platform:'FreeCodeCamp'},{name:'Understanding TypeScript',url:'https://www.udemy.com/course/understanding-typescript/',type:'paid',platform:'Udemy'}],
      aws: [{name:'AWS Roadmap',url:'https://roadmap.sh/aws',type:'free',platform:'Roadmap.sh'},{name:'AWS Practitioner',url:'https://www.freecodecamp.org/news/aws-certified-cloud-practitioner-training-2019-free-video-course/',type:'free',platform:'FreeCodeCamp'},{name:'AWS Developer',url:'https://www.udemy.com/course/aws-certified-developer-associate-dva-c01/',type:'paid',platform:'Udemy'}],
    };
    const def = (s: string) => [{name:`${s} Roadmap`,url:'https://roadmap.sh',type:'free',platform:'Roadmap.sh'},{name:`Learn ${s}`,url:'https://www.freecodecamp.org',type:'free',platform:'FreeCodeCamp'},{name:`${s} Bootcamp`,url:'https://www.udemy.com',type:'paid',platform:'Udemy'}];
    const top = missingSkills.length > 0 ? missingSkills.slice(0, 3) : ['system design', 'ci/cd', 'testing'];
    return top.map(skill => ({ skill, reason: 'This skill appears in the job description and would strengthen your application', resources: map[skill] || def(skill) }));
  }
}