import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as puppeteerCore from 'puppeteer-core';
import { ResumeService, ResumeData } from './resume.service';

@Injectable()
export class ResumeExportService {
  constructor(private readonly resumeService: ResumeService) {}

  async exportToPDF(userId: string, templateId: number = 1): Promise<Buffer> {
    const data = await this.resumeService.getResumeData(userId);
    if (!data)
      throw new NotFoundException(
        'No resume data found. Please build your resume first.',
      );

    const html = this.buildHTML(data, templateId);

    try {
      const chromePaths = [
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Chromium.app/Contents/MacOS/Chromium',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium-browser',
      ];
      const executablePath = chromePaths.find((p) => fs.existsSync(p));
      if (!executablePath)
        throw new Error('Chrome not found. Install Google Chrome.');

      const browser = await puppeteerCore.launch({
        executablePath,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      });

      await browser.close();
      return pdf as Buffer;
    } catch (err: unknown) {
      console.error('Puppeteer export error:', err);
      throw new InternalServerErrorException(
        'PDF export failed. Make sure puppeteer is installed: npm install puppeteer',
      );
    }
  }

  /* ── HTML builder — 3 template styles ───────────────────────── */
  private buildHTML(data: ResumeData, templateId: number): string {
    const body =
      templateId <= 4
        ? this.buildClassicLayout(data)
        : templateId <= 8
          ? this.buildModernLayout(data)
          : this.buildTwoColumnLayout(data);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 210mm; min-height: 297mm; }
    body { font-family: 'DM Sans', sans-serif; font-size: 10.5pt; color: #1a1a1a; background: white; }
    h1 { font-family: 'EB Garamond', serif; }
    a { color: inherit; text-decoration: none; }
  </style>
</head>
<body>${body}</body>
</html>`;
  }

  /* ── Template 1: Classic (templates 1–4) ─────────────────────── */
  private buildClassicLayout(data: ResumeData): string {
    const p = data.personalInfo;
    const contactParts = [
      p.email,
      p.phone,
      p.location,
      p.linkedin,
      p.github,
      p.website,
    ].filter(Boolean);

    return `
<div style="padding: 28mm 20mm 20mm; min-height: 297mm;">

  <!-- Header -->
  <div style="text-align: center; margin-bottom: 18pt; border-bottom: 2pt solid #1a1a1a; padding-bottom: 12pt;">
    <h1 style="font-size: 28pt; font-weight: 700; letter-spacing: -0.5pt; color: #0f172a;">${p.name || 'Your Name'}</h1>
    <p style="margin-top: 6pt; font-size: 8.5pt; color: #64748b; letter-spacing: 0.3pt;">
      ${contactParts.join(' &nbsp;·&nbsp; ')}
    </p>
  </div>

  ${data.summary ? this.section('Summary', `<p style="line-height: 1.7; color: #374151;">${data.summary}</p>`) : ''}

  ${
    data.experience.length
      ? this.section(
          'Experience',
          data.experience
            .map(
              (exp) => `
      <div style="margin-bottom: 12pt;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <div>
            <span style="font-weight: 600; font-size: 11pt;">${exp.title}</span>
            <span style="color: #6b7280; margin-left: 8pt;">${exp.company}${exp.location ? ` · ${exp.location}` : ''}</span>
          </div>
          <span style="color: #9ca3af; font-size: 9pt; white-space: nowrap; margin-left: 8pt;">
            ${exp.startDate}${exp.endDate ? ` – ${exp.endDate}` : ''}
          </span>
        </div>
        ${
          exp.bullets?.filter((b) => b.trim()).length
            ? `
        <ul style="margin-top: 5pt; padding-left: 14pt; list-style: disc; color: #374151;">
          ${exp.bullets
            .filter((b) => b.trim())
            .map(
              (b) =>
                `<li style="margin-bottom: 2pt; line-height: 1.55;">${b}</li>`,
            )
            .join('')}
        </ul>`
            : ''
        }
      </div>`,
            )
            .join(''),
        )
      : ''
  }

  ${
    data.education.length
      ? this.section(
          'Education',
          data.education
            .map(
              (edu) => `
      <div style="display: flex; justify-content: space-between; margin-bottom: 8pt;">
        <div>
          <span style="font-weight: 600;">${edu.degree}</span>
          <span style="color: #6b7280; margin-left: 8pt;">${edu.school}${edu.location ? ` · ${edu.location}` : ''}${edu.gpa ? ` · GPA ${edu.gpa}` : ''}</span>
        </div>
        <span style="color: #9ca3af; font-size: 9pt; white-space: nowrap; margin-left: 8pt;">
          ${edu.startDate}${edu.endDate ? ` – ${edu.endDate}` : ''}
        </span>
      </div>`,
            )
            .join(''),
        )
      : ''
  }

  ${
    data.skills.length
      ? this.section(
          'Skills',
          `<p style="line-height: 1.9; color: #374151;">${data.skills.join(' &nbsp;·&nbsp; ')}</p>`,
        )
      : ''
  }

  ${
    data.projects.length
      ? this.section(
          'Projects',
          data.projects
            .map(
              (proj) => `
      <div style="margin-bottom: 10pt;">
        <span style="font-weight: 600;">${proj.name}</span>
        ${proj.tech?.length ? `<span style="color: #6b7280; margin-left: 6pt; font-size: 9.5pt;">— ${Array.isArray(proj.tech) ? proj.tech.join(', ') : proj.tech}</span>` : ''}
        ${proj.url ? `<a href="${proj.url}" style="color: #0891b2; margin-left: 6pt; font-size: 8.5pt;">${proj.url}</a>` : ''}
        ${proj.description ? `<p style="margin-top: 3pt; color: #374151; line-height: 1.55;">${proj.description}</p>` : ''}
      </div>`,
            )
            .join(''),
        )
      : ''
  }

  ${
    data.certifications.length
      ? this.section(
          'Certifications',
          `<ul style="padding-left: 14pt; list-style: disc; color: #374151;">
      ${data.certifications.map((c) => `<li style="margin-bottom: 2pt;">${c}</li>`).join('')}
    </ul>`,
        )
      : ''
  }

  ${
    data.languages.length
      ? this.section(
          'Languages',
          `<p style="color: #374151;">${data.languages.join(' &nbsp;·&nbsp; ')}</p>`,
        )
      : ''
  }

</div>`;
  }

  /* ── Template 2: Modern dark header (templates 5–8) ─────────── */
  private buildModernLayout(data: ResumeData): string {
    const p = data.personalInfo;
    const contactParts = [
      p.email,
      p.phone,
      p.location,
      p.linkedin,
      p.github,
    ].filter(Boolean);

    return `
<div style="min-height: 297mm; font-family: 'DM Sans', sans-serif;">
  <div style="background: #0f172a; color: white; padding: 20mm 20mm 14mm;">
    <h1 style="font-size: 26pt; font-weight: 700; color: white;">${p.name || 'Your Name'}</h1>
    <p style="margin-top: 6pt; font-size: 8.5pt; color: #94a3b8; letter-spacing: 0.3pt;">
      ${contactParts.join(' &nbsp;·&nbsp; ')}
    </p>
  </div>

  <div style="padding: 16mm 20mm;">
    ${data.summary ? this.section('Summary', `<p style="line-height: 1.7; color: #374151;">${data.summary}</p>`) : ''}

    ${
      data.experience.length
        ? this.section(
            'Experience',
            data.experience
              .map(
                (exp) => `
        <div style="margin-bottom: 12pt;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <div>
              <span style="font-weight: 600; font-size: 11pt;">${exp.title}</span>
              <span style="color: #6b7280; margin-left: 8pt;">${exp.company}${exp.location ? ` · ${exp.location}` : ''}</span>
            </div>
            <span style="color: #9ca3af; font-size: 9pt; white-space: nowrap; margin-left: 8pt;">
              ${exp.startDate}${exp.endDate ? ` – ${exp.endDate}` : ''}
            </span>
          </div>
          ${
            exp.bullets?.filter((b) => b.trim()).length
              ? `
          <ul style="margin-top: 5pt; padding-left: 14pt; list-style: disc; color: #374151;">
            ${exp.bullets
              .filter((b) => b.trim())
              .map(
                (b) =>
                  `<li style="margin-bottom: 2pt; line-height: 1.55;">${b}</li>`,
              )
              .join('')}
          </ul>`
              : ''
          }
        </div>`,
              )
              .join(''),
          )
        : ''
    }

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16pt;">
      <div>
        ${
          data.education.length
            ? this.section(
                'Education',
                data.education
                  .map(
                    (edu) => `
              <div style="margin-bottom: 10pt;">
                <p style="font-weight: 600; font-size: 10pt;">${edu.degree}</p>
                <p style="color: #6b7280; font-size: 9.5pt;">${edu.school}</p>
                <p style="color: #9ca3af; font-size: 8.5pt;">${edu.startDate}${edu.endDate ? ` – ${edu.endDate}` : ''}${edu.gpa ? ` · GPA ${edu.gpa}` : ''}</p>
              </div>`,
                  )
                  .join(''),
              )
            : ''
        }

        ${
          data.certifications.length
            ? this.section(
                'Certifications',
                `<ul style="padding-left: 12pt; list-style: disc; color: #4b5563;">
            ${data.certifications.map((c) => `<li style="margin-bottom: 2pt; font-size: 9.5pt;">${c}</li>`).join('')}
          </ul>`,
              )
            : ''
        }
      </div>

      <div>
        ${
          data.skills.length
            ? this.section(
                'Skills',
                `<div style="display: flex; flex-wrap: wrap; gap: 4pt;">
            ${data.skills.map((s) => `<span style="background: #f1f5f9; border: 1pt solid #e2e8f0; padding: 2pt 8pt; border-radius: 99pt; font-size: 8.5pt; color: #0f172a;">${s}</span>`).join('')}
          </div>`,
              )
            : ''
        }

        ${
          data.languages.length
            ? this.section(
                'Languages',
                `<p style="color: #4b5563; line-height: 1.8;">${data.languages.join('<br/>')}</p>`,
              )
            : ''
        }
      </div>
    </div>

    ${
      data.projects.length
        ? this.section(
            'Projects',
            data.projects
              .map(
                (proj) => `
        <div style="margin-bottom: 10pt;">
          <span style="font-weight: 600;">${proj.name}</span>
          ${proj.tech?.length ? `<span style="background:#dbeafe; color:#1d4ed8; padding: 1pt 6pt; border-radius: 4pt; font-size: 8pt; margin-left: 6pt;">${Array.isArray(proj.tech) ? proj.tech.join(', ') : proj.tech}</span>` : ''}
          ${proj.description ? `<p style="margin-top: 3pt; color: #4b5563; line-height: 1.55; font-size: 9.5pt;">${proj.description}</p>` : ''}
        </div>`,
              )
              .join(''),
          )
        : ''
    }
  </div>
</div>`;
  }

  /* ── Template 3: Two-column (templates 9–12) ─────────────────── */
  private buildTwoColumnLayout(data: ResumeData): string {
    const p = data.personalInfo;

    return `
<div style="display: flex; min-height: 297mm;">

  <!-- Left sidebar -->
  <div style="width: 68mm; background: #1e293b; color: white; padding: 16mm 10mm; flex-shrink: 0;">
    <div style="margin-bottom: 20pt; text-align: center;">
      <h1 style="font-size: 18pt; font-weight: 700; line-height: 1.2; color: white;">${p.name || 'Your Name'}</h1>
    </div>

    <div style="margin-bottom: 16pt;">
      <p style="font-size: 7.5pt; font-weight: 600; text-transform: uppercase; letter-spacing: 1pt; color: #64748b; margin-bottom: 6pt;">Contact</p>
      ${[p.email, p.phone, p.location, p.linkedin, p.github]
        .filter(Boolean)
        .map(
          (c) =>
            `<p style="font-size: 8pt; color: #cbd5e1; margin-bottom: 3pt; word-break: break-all;">${c}</p>`,
        )
        .join('')}
    </div>

    ${
      data.skills.length
        ? `
    <div style="margin-bottom: 16pt;">
      <p style="font-size: 7.5pt; font-weight: 600; text-transform: uppercase; letter-spacing: 1pt; color: #64748b; margin-bottom: 8pt;">Skills</p>
      ${data.skills
        .map(
          (s) => `
        <div style="margin-bottom: 4pt;">
          <p style="font-size: 8.5pt; color: #e2e8f0;">${s}</p>
          <div style="height: 2pt; background: #334155; border-radius: 1pt; margin-top: 2pt;">
            <div style="height: 2pt; background: #38bdf8; border-radius: 1pt; width: 75%;"></div>
          </div>
        </div>`,
        )
        .join('')}
    </div>`
        : ''
    }

    ${
      data.languages.length
        ? `
    <div style="margin-bottom: 16pt;">
      <p style="font-size: 7.5pt; font-weight: 600; text-transform: uppercase; letter-spacing: 1pt; color: #64748b; margin-bottom: 6pt;">Languages</p>
      ${data.languages.map((l) => `<p style="font-size: 8.5pt; color: #cbd5e1; margin-bottom: 3pt;">${l}</p>`).join('')}
    </div>`
        : ''
    }

    ${
      data.certifications.length
        ? `
    <div>
      <p style="font-size: 7.5pt; font-weight: 600; text-transform: uppercase; letter-spacing: 1pt; color: #64748b; margin-bottom: 6pt;">Certifications</p>
      ${data.certifications.map((c) => `<p style="font-size: 8pt; color: #cbd5e1; margin-bottom: 3pt;">${c}</p>`).join('')}
    </div>`
        : ''
    }
  </div>

  <!-- Right main content -->
  <div style="flex: 1; padding: 16mm 14mm 16mm 12mm;">
    ${
      data.summary
        ? `
    <p style="line-height: 1.7; color: #374151; margin-bottom: 16pt; font-size: 10pt;">${data.summary}</p>
    <hr style="border: none; border-top: 1pt solid #e2e8f0; margin-bottom: 16pt;" />`
        : ''
    }

    ${
      data.experience.length
        ? `
    <div style="margin-bottom: 16pt;">
      <p style="font-size: 7.5pt; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5pt; color: #94a3b8; margin-bottom: 10pt;">Experience</p>
      ${data.experience
        .map(
          (exp) => `
        <div style="margin-bottom: 12pt;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-weight: 600; font-size: 11pt;">${exp.title}</span>
            <span style="font-size: 8.5pt; color: #94a3b8;">${exp.startDate}${exp.endDate ? ` – ${exp.endDate}` : ''}</span>
          </div>
          <p style="color: #38bdf8; font-size: 9.5pt; font-weight: 500; margin-top: 1pt;">${exp.company}${exp.location ? ` · ${exp.location}` : ''}</p>
          ${
            exp.bullets?.filter((b) => b.trim()).length
              ? `
          <ul style="margin-top: 5pt; padding-left: 12pt; list-style: disc; color: #4b5563;">
            ${exp.bullets
              .filter((b) => b.trim())
              .map(
                (b) =>
                  `<li style="margin-bottom: 2pt; line-height: 1.6; font-size: 9.5pt;">${b}</li>`,
              )
              .join('')}
          </ul>`
              : ''
          }
        </div>`,
        )
        .join('')}
    </div>`
        : ''
    }

    ${
      data.education.length
        ? `
    <div style="margin-bottom: 16pt;">
      <p style="font-size: 7.5pt; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5pt; color: #94a3b8; margin-bottom: 10pt;">Education</p>
      ${data.education
        .map(
          (edu) => `
        <div style="margin-bottom: 8pt;">
          <div style="display: flex; justify-content: space-between;">
            <span style="font-weight: 600; font-size: 10pt;">${edu.degree}</span>
            <span style="font-size: 8.5pt; color: #94a3b8;">${edu.startDate}${edu.endDate ? ` – ${edu.endDate}` : ''}</span>
          </div>
          <p style="color: #6b7280; font-size: 9.5pt;">${edu.school}${edu.gpa ? ` · GPA ${edu.gpa}` : ''}</p>
        </div>`,
        )
        .join('')}
    </div>`
        : ''
    }

    ${
      data.projects.length
        ? `
    <div>
      <p style="font-size: 7.5pt; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5pt; color: #94a3b8; margin-bottom: 10pt;">Projects</p>
      ${data.projects
        .map(
          (proj) => `
        <div style="margin-bottom: 10pt;">
          <span style="font-weight: 600; font-size: 10pt;">${proj.name}</span>
          ${proj.tech?.length ? `<span style="color: #38bdf8; margin-left: 6pt; font-size: 9pt;">${Array.isArray(proj.tech) ? proj.tech.join(', ') : proj.tech}</span>` : ''}
          ${proj.description ? `<p style="margin-top: 3pt; color: #4b5563; font-size: 9.5pt; line-height: 1.6;">${proj.description}</p>` : ''}
        </div>`,
        )
        .join('')}
    </div>`
        : ''
    }
  </div>
</div>`;
  }

  /* ── Section heading helper ──────────────────────────────────── */
  private section(title: string, content: string): string {
    return `
    <div style="margin-bottom: 14pt;">
      <p style="font-size: 8pt; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5pt;
                color: #64748b; border-bottom: 1pt solid #e2e8f0; padding-bottom: 4pt; margin-bottom: 8pt;">
        ${title}
      </p>
      ${content}
    </div>`;
  }
}
