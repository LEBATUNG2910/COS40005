import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { CvService } from '../cv/cv.service';
import {
  ResumeDataModel,
  ResumeDataDocument,
} from '../database/schemas/resume-data.schema';

/* ─── Data shapes ────────────────────────────────────────────── */
export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
}
export interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}
export interface Education {
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
}
export interface Project {
  name: string;
  tech: string[];
  description: string;
  url: string;
}
export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: string[];
  languages: string[];
}

const EMPTY_RESUME: ResumeData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
};

@Injectable()
export class ResumeService {
  constructor(
    private readonly cvService: CvService,
    @InjectModel(ResumeDataModel.name)
    private resumeModel: Model<ResumeDataDocument>,
  ) {}

  /* ── Parse CV → structured JSON via Gemini ───────────────────── */
  async parseCV(userId: string): Promise<ResumeData> {
    const cv = await this.cvService.getCVByUser(userId);
    if (!cv)
      throw new NotFoundException(
        'No CV uploaded. Please upload your CV first.',
      );

    // Nếu đã có trong MongoDB thì trả về luôn
    const existing = await this.resumeModel.findOne({ userId });
    if (existing) return this.docToResumeData(existing);

    const parsed = await this.callGeminiParse(cv.extractedText);
    await this.upsertResumeData(userId, parsed);
    return parsed;
  }

  /* ── Lưu resume data đã user chỉnh sửa → MongoDB ────────────── */
  async saveResumeData(userId: string, data: ResumeData): Promise<void> {
    await this.upsertResumeData(userId, data);
  }

  /* ── Lấy resume data hiện tại từ MongoDB ────────────────────── */
  async getResumeData(userId: string): Promise<ResumeData | null> {
    const doc = await this.resumeModel.findOne({ userId });
    if (!doc) return null;
    return this.docToResumeData(doc);
  }

  /* ── Re-parse — xóa data cũ, parse lại từ CV gốc ────────────── */
  async reparseCV(userId: string): Promise<ResumeData> {
    await this.resumeModel.deleteOne({ userId });
    return this.parseCV(userId);
  }

  /* ── Upsert vào MongoDB ──────────────────────────────────────── */
  private async upsertResumeData(
    userId: string,
    data: ResumeData,
  ): Promise<void> {
    await this.resumeModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          userId,
          // personalInfo flat
          name: data.personalInfo?.name ?? '',
          email: data.personalInfo?.email ?? '',
          phone: data.personalInfo?.phone ?? '',
          location: data.personalInfo?.location ?? '',
          linkedin: data.personalInfo?.linkedin ?? '',
          github: data.personalInfo?.github ?? '',
          website: data.personalInfo?.website ?? '',
          // sections
          summary: data.summary ?? '',
          experience: data.experience ?? [],
          education: data.education ?? [],
          skills: data.skills ?? [],
          projects: data.projects ?? [],
          certifications: data.certifications ?? [],
          languages: data.languages ?? [],
          updatedAt: new Date(),
        },
        $setOnInsert: { _id: uuidv4(), createdAt: new Date() },
      },
      { upsert: true, returnDocument: 'after' },
    );
  }

  /* ── Convert MongoDB doc → ResumeData interface ──────────────── */
  private docToResumeData(doc: ResumeDataDocument): ResumeData {
    return {
      personalInfo: {
        name: doc.name ?? '',
        email: doc.email ?? '',
        phone: doc.phone ?? '',
        location: doc.location ?? '',
        linkedin: doc.linkedin ?? '',
        github: doc.github ?? '',
        website: doc.website ?? '',
      },
      summary: doc.summary ?? '',
      experience: (doc.experience ?? []) as Experience[],
      education: (doc.education ?? []) as Education[],
      skills: doc.skills ?? [],
      projects: (doc.projects ?? []) as Project[],
      certifications: doc.certifications ?? [],
      languages: doc.languages ?? [],
    };
  }

  /* ── Gọi Gemini để parse CV text → ResumeData JSON ──────────── */
  private async callGeminiParse(cvText: string): Promise<ResumeData> {
    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const prompt = `[Request ID: ${requestId}] You are an expert CV parser. Extract ALL information from this CV text into structured JSON.

CV TEXT:
${cvText.substring(0, 4000)}

Return ONLY valid JSON with this exact structure (no markdown, no backticks):
{
  "personalInfo": { "name": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": "", "website": "" },
  "summary": "",
  "experience": [{ "title": "", "company": "", "location": "", "startDate": "", "endDate": "", "bullets": [] }],
  "education": [{ "degree": "", "school": "", "location": "", "startDate": "", "endDate": "", "gpa": "" }],
  "skills": [],
  "projects": [{ "name": "", "tech": [], "description": "", "url": "" }],
  "certifications": [],
  "languages": []
}

Rules:
- Extract ALL work experience, not just recent ones
- bullets must be full sentences
- If a field is not found, use empty string "" or empty array []
- Do NOT invent information not in the CV
- Dates format: "Mon YYYY" or "YYYY"`;

    const fetchWithRetry = async (
      attemptsLeft: number,
    ): Promise<string | null> => {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.1, maxOutputTokens: 4000 },
            }),
          },
        );
        const data = await response.json();

        if (data?.error?.code === 503 && attemptsLeft > 1) {
          await new Promise((r) => setTimeout(r, 2000));
          return fetchWithRetry(attemptsLeft - 1);
        }
        if (data?.error?.code === 429 && attemptsLeft > 1) {
          const match = (data?.error?.message ?? '').match(
            /retry in ([\d.]+)s/,
          );
          const waitMs = match ? Math.ceil(parseFloat(match[1])) * 1000 : 60000;
          console.warn(`Gemini 429 — waiting ${waitMs / 1000}s`);
          await new Promise((r) => setTimeout(r, waitMs));
          return fetchWithRetry(attemptsLeft - 1);
        }

        return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
      } catch {
        if (attemptsLeft > 1) {
          await new Promise((r) => setTimeout(r, 2000));
          return fetchWithRetry(attemptsLeft - 1);
        }
        return null;
      }
    };

    try {
      const rawText = await fetchWithRetry(3);
      if (!rawText) throw new Error('Gemini unavailable');

      let cleaned = rawText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      const s = cleaned.indexOf('{'),
        e = cleaned.lastIndexOf('}');
      if (s !== -1 && e !== -1) cleaned = cleaned.substring(s, e + 1);

      const parsed = JSON.parse(cleaned) as ResumeData;
      return {
        personalInfo: { ...EMPTY_RESUME.personalInfo, ...parsed.personalInfo },
        summary: parsed.summary ?? '',
        experience: parsed.experience ?? [],
        education: parsed.education ?? [],
        skills: parsed.skills ?? [],
        projects: parsed.projects ?? [],
        certifications: parsed.certifications ?? [],
        languages: parsed.languages ?? [],
      };
    } catch (err) {
      console.error('Resume parse error:', err);
      return { ...EMPTY_RESUME };
    }
  }
}
