import { Injectable, NotFoundException } from '@nestjs/common';
import { CvService } from '../cv/cv.service';

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
  endDate: string;       // 'Present' nếu đang làm
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

/* ─── Fallback trống để frontend không bị crash ─────────────── */
const EMPTY_RESUME: ResumeData = {
  personalInfo: { name: '', email: '', phone: '', location: '', linkedin: '', github: '', website: '' },
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
  // Lưu resume data đã parse/edit theo userId (in-memory)
  private resumeStore = new Map<number, ResumeData>();

  constructor(private readonly cvService: CvService) {}

  /* ── Parse CV text → structured JSON via Gemini ─────────────── */
  async parseCV(userId: number): Promise<ResumeData> {
    const cv = this.cvService.getCVByUser(userId);
    if (!cv) throw new NotFoundException('No CV uploaded. Please upload your CV first.');

    // Nếu đã parse rồi thì trả về luôn (tránh gọi Gemini 2 lần)
    const cached = this.resumeStore.get(userId);
    if (cached) return cached;

    const parsed = await this.callGeminiParse(cv.extractedText);
    this.resumeStore.set(userId, parsed);
    return parsed;
  }

  /* ── Lưu resume data đã user chỉnh sửa ─────────────────────── */
  saveResumeData(userId: number, data: ResumeData): void {
    this.resumeStore.set(userId, data);
  }

  /* ── Lấy resume data hiện tại ───────────────────────────────── */
  getResumeData(userId: number): ResumeData | undefined {
    return this.resumeStore.get(userId);
  }

  /* ── Re-parse (user muốn reset về CV gốc) ───────────────────── */
  async reparseCV(userId: number): Promise<ResumeData> {
    this.resumeStore.delete(userId);
    return this.parseCV(userId);
  }

  /* ── Gọi Gemini để parse text thành structured JSON ─────────── */
  private async callGeminiParse(cvText: string): Promise<ResumeData> {
    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const prompt = `[Request ID: ${requestId}] You are an expert CV parser. Extract ALL information from this CV text into structured JSON.

CV TEXT:
${cvText.substring(0, 4000)}

Return ONLY valid JSON with this exact structure (no markdown, no backticks):
{
  "personalInfo": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "+1234567890",
    "location": "City, Country",
    "linkedin": "https://linkedin.com/in/username",
    "github": "https://github.com/username",
    "website": ""
  },
  "summary": "Professional summary paragraph if present, else empty string",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, Country",
      "startDate": "Jan 2022",
      "endDate": "Present",
      "bullets": [
        "Achievement or responsibility 1",
        "Achievement or responsibility 2"
      ]
    }
  ],
  "education": [
    {
      "degree": "Bachelor of Science in Computer Science",
      "school": "University Name",
      "location": "City, Country",
      "startDate": "2018",
      "endDate": "2022",
      "gpa": "3.8"
    }
  ],
  "skills": ["JavaScript", "React", "Node.js"],
  "projects": [
    {
      "name": "Project Name",
      "tech": ["React", "Node.js"],
      "description": "What it does and impact",
      "url": "https://github.com/..."
    }
  ],
  "certifications": ["AWS Solutions Architect 2023"],
  "languages": ["English (Fluent)", "Vietnamese (Native)"]
}

Rules:
- Extract ALL work experience, not just recent ones
- bullets must be full sentences, not truncated
- If a field is not found, use empty string "" or empty array []
- Do NOT invent information not present in the CV
- Dates should be in format "Mon YYYY" or just "YYYY"`;

    const fetchWithRetry = async (attemptsLeft: number): Promise<string | null> => {
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
          }
        );
        const data = await response.json();

        if (data?.error?.code === 503 && attemptsLeft > 1) {
          await new Promise(r => setTimeout(r, 2000));
          return fetchWithRetry(attemptsLeft - 1);
        }

        return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
      } catch {
        if (attemptsLeft > 1) {
          await new Promise(r => setTimeout(r, 2000));
          return fetchWithRetry(attemptsLeft - 1);
        }
        return null;
      }
    };

    try {
      const rawText = await fetchWithRetry(3);
      if (!rawText) throw new Error('Gemini unavailable');

      // Strip markdown fences nếu có
      let cleaned = rawText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const jsonStart = cleaned.indexOf('{');
      const jsonEnd = cleaned.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
      }

      const parsed = JSON.parse(cleaned) as ResumeData;

      // Merge với EMPTY_RESUME để đảm bảo tất cả fields tồn tại
      return {
        personalInfo: { ...EMPTY_RESUME.personalInfo, ...parsed.personalInfo },
        summary:        parsed.summary        ?? '',
        experience:     parsed.experience     ?? [],
        education:      parsed.education      ?? [],
        skills:         parsed.skills         ?? [],
        projects:       parsed.projects       ?? [],
        certifications: parsed.certifications ?? [],
        languages:      parsed.languages      ?? [],
      };
    } catch (err) {
      console.error('Resume parse error:', err);
      // Trả về empty thay vì throw — frontend vẫn dùng được, user tự điền
      return { ...EMPTY_RESUME };
    }
  }
}