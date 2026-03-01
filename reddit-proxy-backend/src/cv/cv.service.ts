import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import { execSync } from 'child_process';

interface CvRecord {
  userId: number;
  fileName: string;
  filePath: string;
  extractedText: string;
  templateId: number;
  uploadedAt: Date;
  pageCount: number;
}

@Injectable()
export class CvService {
  private cvStore = new Map<number, CvRecord>();

  async extractTextFromPDF(filePath: string): Promise<{ text: string; pageCount: number }> {
    const possiblePaths = [
      '/opt/homebrew/bin/pdftotext',
      '/usr/local/bin/pdftotext',
      'pdftotext',
      '/usr/bin/pdftotext',
    ];

    let pdfToTextPath = '';
    for (const p of possiblePaths) {
      try {
        execSync(`"${p}" -v 2>&1`, { encoding: 'utf8' });
        pdfToTextPath = p;
        break;
      } catch { continue; }
    }

    if (pdfToTextPath) {
      try {
        const text = execSync(`"${pdfToTextPath}" -layout "${filePath}" -`, {
          encoding: 'utf8',
          maxBuffer: 10 * 1024 * 1024,
          env: { ...process.env, PATH: '/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin' },
        });

        let pageCount = 1;
        try {
          const pdfinfoPath = pdfToTextPath.replace('pdftotext', 'pdfinfo');
          const info = execSync(`"${pdfinfoPath}" "${filePath}"`, { encoding: 'utf8' });
          const match = info.match(/Pages:\s+(\d+)/);
          if (match) pageCount = parseInt(match[1]);
        } catch { pageCount = 1; }

        if (text.trim().length > 30) {
          return { text: text.trim(), pageCount };
        }
      } catch (e) {
        console.error('pdftotext failed:', e);
      }
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const pdfParseLib = require('pdf-parse');
      const pdfParse = pdfParseLib.default ?? pdfParseLib;
      const buffer = fs.readFileSync(filePath);
      const data = await pdfParse(buffer);
      return { text: data.text, pageCount: data.numpages };
    } catch {
      throw new BadRequestException('Cannot extract PDF. Run: brew install poppler');
    }
  }

  async saveCV(userId: number, file: Express.Multer.File, templateId: number): Promise<CvRecord> {
    const { text, pageCount } = await this.extractTextFromPDF(file.path);

    if (!text || text.trim().length < 30) {
      fs.unlinkSync(file.path);
      throw new BadRequestException('Could not extract text. Ensure PDF is not image-only.');
    }

    const record: CvRecord = {
      userId,
      fileName: file.originalname,
      filePath: file.path,
      extractedText: text,
      templateId,
      uploadedAt: new Date(),
      pageCount,
    };

    this.cvStore.set(userId, record);
    return record;
  }

  getCVByUser(userId: number): CvRecord | undefined {
    return this.cvStore.get(userId);
  }

  async analyzeCV(userId: number, jobDescription: string): Promise<any> {
    const cv = this.cvStore.get(userId);
    if (!cv) throw new NotFoundException('No CV found. Please upload your CV first.');

    const matchScore = this.calculateBM25Score(cv.extractedText, jobDescription);
    const jdSkills = this.extractSkills(jobDescription);
    const cvSkills = this.extractSkills(cv.extractedText);
    const missingSkills = jdSkills.filter(s => !cvSkills.includes(s));

    const aiAnalysis = await this.callGeminiAI(cv.extractedText, jobDescription, missingSkills);

    return {
      fileName: cv.fileName,
      pageCount: cv.pageCount,
      templateId: cv.templateId,
      uploadedAt: cv.uploadedAt,
      preview: cv.extractedText.substring(0, 400).trim(),
      matchScore: Math.min(Math.round(matchScore * 100), 99),
      cvSkills,
      jdSkills,
      missingSkills,
      aiAnalysis,
    };
  }

  private calculateBM25Score(cvText: string, jdText: string): number {
    const k1 = 1.5, b = 0.75;
    const tokenize = (text: string) =>
      text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(t => t.length > 2);

    const stopWords = new Set([
      'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was',
      'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may',
      'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'does', 'let',
      'put', 'say', 'she', 'too', 'use', 'with', 'that', 'this', 'have', 'from',
      'they', 'will', 'been', 'into', 'more', 'also', 'what', 'than', 'then',
      'when', 'your', 'each', 'able', 'work', 'well',
    ]);

    const tokenizeFiltered = (text: string) =>
      tokenize(text).filter(t => !stopWords.has(t));

    const cvTokens = tokenizeFiltered(cvText);
    const jdTokens = tokenizeFiltered(jdText);

    const tf = new Map<string, number>();
    cvTokens.forEach(t => tf.set(t, (tf.get(t) || 0) + 1));

    // FIX 1: dùng đúng độ dài CV hiện tại làm avgdl
    // vì chỉ có 1 document — normalize length penalty không có ý nghĩa
    // → đặt b=0 để tắt length normalization hoàn toàn
    const avgdl = cvTokens.length || 1;

    let score = 0;
    const uniqueJdTerms = [...new Set(jdTokens)];

    uniqueJdTerms.forEach(term => {
      const f = tf.get(term) || 0;
      if (f > 0) {
        // FIX 2: b=0 → tắt length penalty (cvTokens.length/avgdl = 1 luôn)
        // công thức rút gọn: bm25 = f*(k1+1) / (f+k1)
        const bm25 = (f * (k1 + 1)) / (f + k1 * (1 - b + b * (cvTokens.length / avgdl)));
        score += bm25;
      }
    });

    const jdSkills = this.extractSkills(jdText);
    const cvSkills = this.extractSkills(cvText);

    const matchedSkills = cvSkills.filter(s => jdSkills.includes(s));
    const skillMatchRatio = jdSkills.length > 0
      ? matchedSkills.length / jdSkills.length
      : 0;

    const maxPossible = uniqueJdTerms.length * (k1 + 1);
    const bm25Score = maxPossible === 0 ? 0 : Math.min(score / maxPossible, 1);

    // FIX 3: tăng trọng số skill match lên 50%
    // skill match đo đúng hơn BM25 trong trường hợp 1 document
    const combined = bm25Score * 0.5 + skillMatchRatio * 0.5;

    // FIX 4: bonus khi skill match cao — tránh bị kéo xuống bởi BM25 thấp
    // Nếu 80%+ skills match → boost thêm tối đa 10 điểm
    const bonus = skillMatchRatio >= 0.8 ? (skillMatchRatio - 0.8) * 0.5 : 0;

    return Math.min(combined + bonus, 1);
  }

  private extractSkills(text: string): string[] {
    const skillKeywords = [
      'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'scala',
      'react', 'vue', 'angular', 'nextjs', 'html', 'css', 'tailwind', 'sass', 'redux', 'graphql', 'webpack', 'vite',
      'nodejs', 'nestjs', 'express', 'django', 'spring', 'fastapi', 'laravel', 'flask',
      'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'sqlite', 'firebase',
      'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'terraform', 'ansible', 'jenkins', 'github actions',
      'git', 'linux', 'rest api', 'microservices', 'agile', 'scrum',
      'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas', 'numpy',
      'figma', 'jira', 'postman', 'jest', 'cypress', 'swagger', 'fullstack', 'full-stack', 'restful', 'api documentation',
  'oop', 'solid', 'design pattern', 'microservices', 'rabbitmq', 'kafka', 'redis', 'graphql', 'apollo', 'serverless', 'lambda', 'cloud functions', 'ci/cd', 'continuous integration', 'continuous deployment',
    ];
    const lowerText = text.toLowerCase();
    return skillKeywords.filter(skill => lowerText.includes(skill));
  }

  private async callGeminiAI(cvText: string, jdText: string, missingSkills: string[]): Promise<any> {
    const missingSkillsText = missingSkills.length > 0
      ? missingSkills.join(', ')
      : 'No keyword-based missing skills detected, but analyze the CV depth and suggest improvements anyway';

    const prompt = `You are an expert career coach and senior technical recruiter with 15+ years experience.

CV TEXT (first 3000 chars):
${cvText.substring(0, 3000)}

JOB DESCRIPTION:
${jdText.substring(0, 2000)}

MISSING SKILLS DETECTED BY KEYWORD MATCHING: ${missingSkillsText}

IMPORTANT: You MUST always provide exactly 3 skill suggestions in the "suggestions" array. 
Even if the CV has matching keywords, analyze the DEPTH of experience, look for gaps in advanced topics, soft skills, or tools mentioned in the JD that could be strengthened.

Respond ONLY with valid JSON (no markdown, no backticks, no extra text before or after):
{
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
  "weaknesses": ["specific weakness 1", "specific weakness 2"],
  "suggestions": [
    {
      "skill": "skill name",
      "reason": "specific reason why this skill would strengthen this application",
      "resources": [
        { "name": "Resource title", "url": "https://roadmap.sh/...", "type": "free", "platform": "Roadmap.sh" },
        { "name": "Resource title", "url": "https://www.freecodecamp.org/...", "type": "free", "platform": "FreeCodeCamp" },
        { "name": "Resource title", "url": "https://www.udemy.com/course/...", "type": "paid", "platform": "Udemy" }
      ]
    },
    {
      "skill": "skill name 2",
      "reason": "...",
      "resources": [...]
    },
    {
      "skill": "skill name 3",
      "reason": "...",
      "resources": [...]
    }
  ],
  "overallFeedback": "2-3 sentence honest, specific assessment of this CV for this exact role."
}

Rules:
- ALWAYS include exactly 3 suggestions - this is mandatory
- Use REAL, working URLs from roadmap.sh, freecodecamp.org, udemy.com, or youtube.com
- Be specific about the candidate's actual CV content, not generic advice
- Strengths and weaknesses must reference specific things in their CV`;

    try {
      // ✅ FIX: Đổi từ gemini-2.5-flash (deprecated) 
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 3000,
            },
          }),
        }
      );

      const data = await response.json();
      console.log('Gemini raw response:', JSON.stringify(data).substring(0, 500));

      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        console.error('Gemini returned no text. Full response:', JSON.stringify(data));
        throw new Error('Gemini returned empty response');
      }

      let cleaned = rawText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^\s*json\s*/i, '')
        .trim();

      const jsonStart = cleaned.indexOf('{');
      const jsonEnd = cleaned.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
      }

      const parsed = JSON.parse(cleaned);

      if (!parsed.suggestions || parsed.suggestions.length === 0) {
        parsed.suggestions = this.buildFallbackSuggestions(missingSkills);
      }

      return parsed;
    } catch (err) {
      console.error('Gemini AI error:', err);
      return {
        strengths: [
          'CV has been analyzed and shows relevant experience',
          'Technical skills align with the job requirements',
          'Educational background supports this role',
        ],
        weaknesses: [
          'Could not complete detailed AI analysis — please retry',
          'Some skills mentioned in JD may need stronger evidence in CV',
        ],
        suggestions: this.buildFallbackSuggestions(missingSkills),
        overallFeedback: 'Basic keyword analysis completed. Please retry the analysis for detailed AI-powered insights from Gemini.',
      };
    }
  }

  private buildFallbackSuggestions(missingSkills: string[]): any[] {
    const resourceMap: Record<string, any[]> = {
      'docker': [
        { name: 'Docker Roadmap', url: 'https://roadmap.sh/docker', type: 'free', platform: 'Roadmap.sh' },
        { name: 'Docker for Beginners', url: 'https://www.freecodecamp.org/news/docker-simplified/', type: 'free', platform: 'FreeCodeCamp' },
        { name: 'Docker & Kubernetes: The Practical Guide', url: 'https://www.udemy.com/course/docker-kubernetes-the-practical-guide/', type: 'paid', platform: 'Udemy' },
      ],
      'kubernetes': [
        { name: 'Kubernetes Roadmap', url: 'https://roadmap.sh/kubernetes', type: 'free', platform: 'Roadmap.sh' },
        { name: 'Kubernetes Course', url: 'https://www.freecodecamp.org/news/the-kubernetes-handbook/', type: 'free', platform: 'FreeCodeCamp' },
        { name: 'Kubernetes for Absolute Beginners', url: 'https://www.udemy.com/course/learn-kubernetes/', type: 'paid', platform: 'Udemy' },
      ],
      'typescript': [
        { name: 'TypeScript Roadmap', url: 'https://roadmap.sh/typescript', type: 'free', platform: 'Roadmap.sh' },
        { name: 'TypeScript Handbook', url: 'https://www.freecodecamp.org/news/learn-typescript-beginners-guide/', type: 'free', platform: 'FreeCodeCamp' },
        { name: 'Understanding TypeScript', url: 'https://www.udemy.com/course/understanding-typescript/', type: 'paid', platform: 'Udemy' },
      ],
      'postgresql': [
        { name: 'PostgreSQL Tutorial', url: 'https://www.freecodecamp.org/news/postgresql-full-course/', type: 'free', platform: 'FreeCodeCamp' },
        { name: 'SQL and PostgreSQL', url: 'https://www.udemy.com/course/sql-and-postgresql/', type: 'paid', platform: 'Udemy' },
        { name: 'Learn SQL', url: 'https://www.youtube.com/watch?v=qw--VYLpxG4', type: 'free', platform: 'YouTube' },
      ],
      'aws': [
        { name: 'AWS Roadmap', url: 'https://roadmap.sh/aws', type: 'free', platform: 'Roadmap.sh' },
        { name: 'AWS Cloud Practitioner', url: 'https://www.freecodecamp.org/news/aws-certified-cloud-practitioner-training-2019-free-video-course/', type: 'free', platform: 'FreeCodeCamp' },
        { name: 'AWS Certified Developer', url: 'https://www.udemy.com/course/aws-certified-developer-associate-dva-c01/', type: 'paid', platform: 'Udemy' },
      ],
    };

    const defaultResources = (skill: string) => [
      { name: `${skill} Roadmap`, url: `https://roadmap.sh`, type: 'free', platform: 'Roadmap.sh' },
      { name: `Learn ${skill} - Full Course`, url: `https://www.freecodecamp.org`, type: 'free', platform: 'FreeCodeCamp' },
      { name: `${skill} Bootcamp`, url: `https://www.udemy.com`, type: 'paid', platform: 'Udemy' },
    ];

    const topSkills = missingSkills.length > 0
      ? missingSkills.slice(0, 3)
      : ['system design', 'ci/cd', 'testing'];

    return topSkills.map(skill => ({
      skill,
      reason: `This skill appears in the job description and would strengthen your application`,
      resources: resourceMap[skill] || defaultResources(skill),
    }));
  }
}