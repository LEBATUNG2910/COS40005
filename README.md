# 🧑‍💼 HireWise — AI-Powered Resume Builder

> A full-stack, production-ready **Resume Builder Web Application** built with **React + Vite** on the frontend and **NestJS** on the backend. Features AI-powered CV analysis using **Google Gemini**, smart job-matching with the **BM25 algorithm**, JWT-based authentication, PDF extraction, a live resume editor, and PDF export via Puppeteer.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Live Features](#-live-features)
- [Architecture](#-architecture)
- [Frontend](#-frontend)
- [Backend](#-backend)
- [Resume Builder — Backend](#-resume-builder--backend)
- [Database — MongoDB](#-database--mongodb)
- [Resume Builder — Frontend](#-resume-builder--frontend)
- [AI & Matching Engine](#-ai--matching-engine)
- [Authentication](#-authentication)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)

---

## 🌐 Overview

**HireWise** helps job seekers create, optimize, and analyze their resumes against real job descriptions. The app combines traditional keyword matching (BM25) with Google Gemini AI to give actionable feedback on CV quality, skill gaps, and learning recommendations.

**Core user flow:**
```
Register / Login → Upload CV (PDF) → Choose Template → Paste Job Description
  → Get AI Analysis + Match Score → Build & Edit Resume → Export PDF
```

---

## ✨ Live Features

### 🏠 Landing Page
A fully responsive, scroll-animated marketing page:

| Section | File | Description |
|---|---|---|
| Hero | `hero.jsx` | Animated headline, CTA buttons, floating resume mockup |
| AI Section | `ai-section.jsx` | Showcases AI analysis capabilities with live demo feel |
| ATS Optimizer | `ats-section.jsx` | Explains how the app helps beat Applicant Tracking Systems |
| Career Tools | `career-tools.jsx` | Overview of job-matching, scoring, and suggestion features |
| Template Showcase | `template-showcase.jsx` | Paginated carousel of 12 resume templates with swipe animations |
| Testimonials | `testimonials.jsx` | Social proof with user reviews |
| Social Proof | `social-proof.jsx` | Stats, trust badges, partner logos |
| Features | `features.jsx` | Feature grid with icons and descriptions |
| Footer | `footer.jsx` | Links, social media, copyright |

---

### 📊 CV Analyst (`/analyst`)
The core feature of the app — paste a Job Description, get a full AI analysis:

- **BM25 Match Score** (0–99) — measures textual overlap between CV and JD using BM25, combined with skill-match ratio (30/50/20 weighting + bonus for high skill coverage)
- **Skills in Your CV** — extracted from a curated list of 77 tech keywords
- **Missing Skills** — skills mentioned in JD but absent from CV
- **AI Assessment** (Gemini) — personalized 2–3 sentence overall feedback
- **Strengths** — 3 specific strengths identified from the actual CV content
- **Areas to Improve** — 2 specific weaknesses with actionable advice
- **Learning Roadmap** — 3 skill suggestions, each with 3 curated resources (Roadmap.sh, FreeCodeCamp, Udemy/YouTube)

---

### 📄 Resume Upload (`/upload`)
Drag-and-drop CV upload interface:

- Accepts **PDF only** (max 10MB)
- Backend extracts text via a 3-layer strategy (see [PDF Extraction Strategy](#pdf-extraction-strategy))
- Extracted text stored server-side, linked to authenticated user
- Supports re-upload to replace existing CV

---

### 🖼️ Template Selection (`/selection`)
Browse and select from **12 professionally designed** resume templates:

- Animated grid with hover effects (`framer-motion`)
- Templates: Double Column, Ivy League, Elegant, Contemporary, Polished, Modern, Creative, Timeline, Stylish, Single Column, Elegant with Logos, Double Column with Logos
- Selected template ID saved to Context and passed to backend on upload

---

### 🏗️ Resume Builder (`/builder`)
Full resume editor with live preview and PDF export:

- **Auto-parse** — Gemini extracts CV into 8 structured form sections on first load
- **Live preview** — real-time preview scaled at 85%, matches final PDF output
- **Auto-save** — debounced 1.2s after each edit, saves silently to backend
- **Export PDF** — Puppeteer renders HTML → downloads `resume-<timestamp>.pdf`
- **Reset from CV** — re-parses original uploaded CV at any time
- **Mobile toggle** — preview hidden by default on small screens

---

### 👤 Account Page (`/account`)
Profile management with sidebar navigation:

- **Profile tab** — edit full name, language preference, newsletter opt-in
- **Password change** — modal with current/new/confirm fields and show/hide toggle
- **Account actions** — Sign Out of All Devices, Delete Account
- **Billing tab** — Pro upgrade card with monthly/yearly toggle and feature list

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                     │
│  Landing → Auth → Upload → Template → Analyst → Builder → Account │
└─────────────────────────┬────────────────────────────────────┘
                          │ REST API (fetch)
                          │ Authorization: Bearer <JWT>
┌─────────────────────────▼────────────────────────────────────┐
│                    BACKEND (NestJS :3001)                      │
│                                                                │
│  AuthModule    ──→  JWT Sign/Verify   ──→  UsersService        │
│  CvModule      ──→  PDF Extract       ──→  CvStore (Map)       │
│                ──→  BM25 Engine       ──→  Score               │
│                ──→  Gemini Vision     ──→  CV Text (all types) │
│                ──→  Gemini AI         ──→  Analysis JSON       │
│  ResumeModule  ──→  Gemini Parse      ──→  ResumeStore (Map)   │
│                ──→  Puppeteer         ──→  PDF Export          │
│  DatabaseModule──→  MongoDB           ──→  HireWiseDB          │
└──────────────────────────────────────────────────────────────┘
```

> **Note:** CV and resume data are currently **in-memory** (`Map<userId, Record>`). MongoDB schemas are fully implemented and ready — migration to persistent storage is the next step.

---

## 🖥️ Frontend

### Pages & Routing

| Route | Component | Description |
|---|---|---|
| `/` | `home.jsx` | Landing page |
| `/auth` | `sign_in.jsx` / `sign_up.jsx` | Login and Register |
| `/upload` | `cv-upload.jsx` | CV upload (Step 1) |
| `/selection` | `ResumeTemplateSelection.jsx` | Template picker (Step 2) |
| `/analyst` | `page.jsx` | CV analysis dashboard (Step 3) |
| `/builder` | `builder/page.jsx` | Resume editor + PDF export |
| `/account` | `account.jsx` | User profile & settings |
| `/process` | `HowItWork.jsx` | Onboarding entry point |
| `/resource` | `Resource.jsx` | Blog / resources |

### State Management
Global state via **React Context API** (`FileContext`):
```js
{
  uploadedFile: File | null,
  selectedTemplateId: number | null
}
```

---

## ⚙️ Backend

Built with **NestJS**, running on port `3001`.

### Modules

#### `AuthModule`
| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/register` | POST | Create account (fullName, email, phone, password, gender) |
| `/api/auth/login` | POST | Login with email/phone + password, supports rememberMe |
| `/api/auth/me` | GET | Get current user info (JWT required) |
| `/api/auth/profile` | PATCH | Update fullName and language |
| `/api/auth/change-password` | PATCH | Change password with current password verification |

#### `CvModule`
| Endpoint | Method | Description |
|---|---|---|
| `/api/cv/upload` | POST | Upload PDF, extract text, store by userId |
| `/api/cv/me` | GET | Get current user's CV metadata |
| `/api/cv/preview` | GET | Stream the original PDF for iframe preview |
| `/api/cv/analyze` | POST | Run BM25 + Gemini analysis against a JD |

### PDF Extraction Strategy

Three-layer strategy supporting all CV types:

```
1. pdftotext (poppler)  — best quality, preserves layout
2. pdf-parse (npm)      — pure JS fallback, works everywhere
3. Gemini Vision        — sends PDF as base64, reads any CV type
```

| CV Type | Method used |
|---|---|
| Plain text PDF | pdftotext |
| 2-column / designed layout | Gemini Vision |
| Scanned from paper | Gemini Vision |
| Canva / Figma export | Gemini Vision |
| CV with avatar photo | Gemini Vision (ignores image) |

Response includes `extractionMethod: 'pdftotext' | 'pdf-parse' | 'gemini-vision'`.

---

## 📝 Resume Builder — Backend

### File Structure

```
src/resume/
├── resume.controller.ts
├── resume.service.ts
├── resume.module.ts
├── resume-export.controller.ts
└── resume-export.service.ts
```

### API Endpoints

All require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/resume/parse` | Parse CV → ResumeData JSON (cached) |
| `POST` | `/api/resume/reparse` | Delete cache, re-parse from original CV |
| `GET` | `/api/resume/data` | Get current data (parsed or edited) |
| `PUT` | `/api/resume/data` | Save user edits |
| `POST` | `/api/resume/export` | Export to PDF via Puppeteer |

### ResumeData Interface

```typescript
{
  personalInfo: { name, email, phone, location, linkedin, github, website },
  summary: string,
  experience: [{ title, company, location, startDate, endDate, bullets: string[] }],
  education:  [{ degree, school, location, startDate, endDate, gpa }],
  skills: string[],
  projects:   [{ name, tech: string[], description, url }],
  certifications: string[],
  languages: string[]
}
```

### Parse Flow

```
POST /api/resume/parse
  ├── Check CV uploaded (cvStore)
  ├── Check cache (resumeStore) → return immediately if hit
  ├── Call Gemini gemini-2.5-flash-lite (temperature: 0.1)
  ├── Parse JSON → merge with EMPTY_RESUME
  └── Cache in resumeStore
```

### Export Flow

```
POST /api/resume/export { templateId: 1–12 }
  ├── Fetch resume data
  ├── Build HTML (3 layout styles)
  ├── Launch Puppeteer with local Chrome
  ├── page.pdf({ format: 'A4', printBackground: true })
  └── Stream as attachment download
```

| templateId | Layout | Style |
|---|---|---|
| 1–4 | Classic | Centered header, EB Garamond serif |
| 5–8 | Modern | Dark header, skill tags, two-column bottom |
| 9–12 | Two-column | Dark sidebar, light main content |

### Retry Logic

- **503** → retry after 2s (up to 3 attempts)
- **429 RPM** → parse `"retry in Xs"` from error message → wait exact duration → retry

---

## 🗄️ Database — MongoDB

### Setup

```bash
# Start MongoDB
docker run -d --name hirewise-mongo -p 27017:27017 -v hirewise-data:/data/db mongo:7

# Run migration (ONE TIME — drops existing data)
docker exec -i hirewise-mongo mongosh < hirewise_mongo_init.js

# Install packages
npm install @nestjs/mongoose mongoose @nestjs/config
```

Add to `.env`:
```
MONGODB_URI=mongodb://localhost:27017/HireWiseDB
```

### File Structure

```
src/database/
├── database.module.ts
└── schemas/
    ├── user.schema.ts
    ├── refresh-token.schema.ts
    ├── cv-upload.schema.ts
    ├── cv-analysis.schema.ts        # + cvAnalysisSkills, aiInsights, aiSuggestions, learningResources
    ├── template-skill.schema.ts     # + skills
    ├── subscription.schema.ts       # + planFeatures, userSubscriptions, teamMembers
    └── misc.schema.ts               # redditCache (TTL), auditLogs
```

### Collections

| Collection | Description | Seed |
|---|---|---|
| `users` | User accounts | — |
| `refreshTokens` | JWT sessions | — |
| `cvUploads` | CV files + extracted text | — |
| `cvAnalyses` | Analysis results | — |
| `cvAnalysisSkills` | Skills per analysis (CV/JD/MISSING) | — |
| `aiInsights` | Strengths & weaknesses | — |
| `aiSuggestions` | Skill suggestions | — |
| `learningResources` | Learning links | — |
| `resumeTemplates` | Resume templates | 12 |
| `skills` | Skills catalog | 77 |
| `pricingPlans` | Starter / Pro / Team | 3 |
| `planFeatures` | Features per plan | 12 |
| `userSubscriptions` | User subscriptions | — |
| `teamMembers` | Team plan members | — |
| `redditCache` | Reddit proxy cache (5-min TTL) | — |
| `auditLogs` | Activity log | — |

### Collection Relationships

```
users
  ├── refreshTokens      (userId)
  ├── cvUploads          (userId)
  │     └── cvAnalyses   (cvUploadId)
  │           ├── cvAnalysisSkills  (analysisId)
  │           ├── aiInsights        (analysisId)
  │           └── aiSuggestions     (analysisId)
  │                 └── learningResources (suggestionId)
  └── userSubscriptions  (userId → pricingPlans)
        └── teamMembers  (subscriptionId)
```

### Common / Shared Utilities

```
src/common/
├── index.ts
├── guards/jwt-auth.guard.ts              # @UseGuards(JwtAuthGuard)
├── decorators/current-user.decorator.ts  # @CurrentUser() → JwtPayload
└── filters/all-exceptions.filter.ts      # Global error handler
```

`AllExceptionsFilter` returns consistent JSON errors:
```json
{
  "statusCode": 404,
  "message": "No CV found",
  "path": "/api/resume/parse",
  "timestamp": "2026-03-10T09:00:00.000Z"
}
```

---

## 📋 Resume Builder — Frontend

### File

```
src/app/builder/page.jsx   →   route: /builder
```

Navigated to from Analyst page via **"Build Resume →"** button.

### Load Flow

```
Mount
  ├── GET /api/resume/data
  │     ├── hasData: true  → populate form (cached)
  │     └── hasData: false → POST /api/resume/parse → populate form
  └── Render editor + live preview
```

### Features

| Feature | Description |
|---|---|
| Auto-parse | Gemini extracts CV → populates all 8 form sections |
| Section quick-jump | Cyan pill buttons, smooth scroll |
| Live preview | Real-time, scaled 85%, matches PDF output |
| Auto-save | Debounced 1.2s → `PUT /api/resume/data` silently |
| Reset from CV | `POST /api/resume/reparse` |
| Export PDF | `POST /api/resume/export` → `resume-<timestamp>.pdf` |
| Mobile toggle | Eye icon shows/hides preview |
| Error handling | Editable form even if parse fails |

### Components

| Component | Description |
|---|---|
| `Field` | Reusable input / textarea |
| `SectionCard` | Collapsible card with `framer-motion` animation |
| `PersonalInfoEditor` | 2-column grid for contact fields |
| `ExperienceEditor` | Positions with dynamic bullet points |
| `EducationEditor` | Education entries |
| `SkillsEditor` | Tag-style — Enter to add, × to remove |
| `ProjectsEditor` | Projects with comma-separated tech stack |
| `ListEditor` | Reusable for Certifications and Languages |
| `ResumePreview` | Live HTML matching PDF export layout |

---

## 🤖 AI & Matching Engine

### BM25 Scoring

```
bm25Score    = Σ BM25(term) / maxPossible        (k1=1.5, b=0.75)
skillMatch   = matched_skills / total_jd_skills
depthScore   = avg occurrences per JD skill (capped)

combined     = bm25Score × 0.30 + skillMatch × 0.50 + depthScore × 0.20
bonus        = skillMatch ≥ 0.8 ? (skillMatch - 0.8) × 0.5 : 0
finalScore   = min(combined + bonus, 1) × 100
```

### Gemini Models Used

| Purpose | Model | Temp |
|---|---|---|
| CV analysis | `gemini-2.5-flash-lite` | 0.85 |
| Resume parse | `gemini-2.5-flash-lite` | 0.1 |
| PDF extraction | `gemini-2.5-flash-lite` (Vision) | 0.1 |

### Gemini Free Tier

| Model | RPM | RPD | RPD reset |
|---|---|---|---|
| gemini-2.5-flash | 10 | 500 | 15:00 VN time |
| gemini-2.5-flash-lite | 15 | 1,500 | 15:00 VN time |

---

## 🔐 Authentication

| Mode | Storage |
|---|---|
| Normal login | `sessionStorage` |
| Remember Me | `localStorage` |

```js
authService.getToken()
authService.saveToken(token, rememberMe)
authService.logout()
```

---

## 🧱 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite 5 | UI framework + build tool |
| Tailwind CSS 3 | Styling |
| Framer Motion | Animations |
| Lucide React | Icons |
| React Router DOM 6 | Routing |
| Shadcn/UI | UI components |

### Backend
| Technology | Purpose |
|---|---|
| NestJS 10 | Framework |
| JWT / Passport | Auth |
| bcryptjs | Password hashing |
| Multer | File upload |
| pdf-parse + poppler | PDF extraction |
| puppeteer-core | PDF export |
| Mongoose + MongoDB | Database |

---

## 📁 Project Structure

```
COS40005/
├── frontend/src/
│   ├── app/
│   │   ├── home/           landing page
│   │   ├── auth/           sign_in.jsx, sign_up.jsx
│   │   ├── upload/         cv-upload.jsx
│   │   ├── selection/      ResumeTemplateSelection.jsx
│   │   ├── analyst/        page.jsx
│   │   ├── builder/        page.jsx
│   │   └── account/        account.jsx
│   ├── components/         header, hero, template-showcase, ...
│   ├── context/            FileContext.jsx
│   └── services/           authService.js
│
└── reddit-proxy-backend/src/
    ├── auth/
    ├── cv/                 cv.controller.ts, cv.service.ts
    ├── resume/             resume.*.ts, resume-export.*.ts
    ├── users/
    ├── reddit/
    ├── database/
    │   ├── database.module.ts
    │   └── schemas/        7 schema files → 16 collections
    ├── common/             guards, decorators, filters
    ├── app.module.ts
    └── main.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker
- Google Chrome (for Puppeteer)

```bash
# Optional — improves PDF extraction quality on macOS
brew install poppler
```

### MongoDB

```bash
docker run -d --name hirewise-mongo -p 27017:27017 -v hirewise-data:/data/db mongo:7
docker exec -i hirewise-mongo mongosh < hirewise_mongo_init.js
```

### Frontend

```bash
cd frontend && npm install && npm run dev
# → http://localhost:5173
```

### Backend

```bash
cd reddit-proxy-backend
npm install puppeteer-core @nestjs/mongoose mongoose @nestjs/config
npm run start:dev
# → http://localhost:3001
```

---

## 🔐 Environment Variables

```dotenv
PORT=3001
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=100y
JWT_REMEMBER_EXPIRES_IN=100y
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=mongodb://localhost:27017/HireWiseDB
```

---

## 📡 API Reference

### Auth
```http
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PATCH  /api/auth/profile
PATCH  /api/auth/change-password
```

### CV
```http
POST   /api/cv/upload       # multipart/form-data: file, templateId
GET    /api/cv/me
GET    /api/cv/preview
POST   /api/cv/analyze      # body: { jobDescription }
```

### Resume
```http
POST   /api/resume/parse
POST   /api/resume/reparse
GET    /api/resume/data
PUT    /api/resume/data
POST   /api/resume/export   # body: { templateId: 1–12 }
```

---

## 🗺️ Roadmap

- [x] CV upload + PDF text extraction (pdftotext / pdf-parse / Gemini Vision)
- [x] BM25 + skill match + depth scoring engine
- [x] Gemini AI analysis (strengths, weaknesses, suggestions, learning resources)
- [x] JWT authentication (login, register, remember me)
- [x] Resume Builder — parse → edit → live preview → export PDF (Puppeteer)
- [x] MongoDB schemas (16 collections, Mongoose, ready for migration)
- [ ] Migrate cv/resume services from in-memory Map → MongoDB
- [ ] Refresh token rotation
- [ ] Forgot password + email verification
- [ ] Google OAuth login
- [ ] Stripe payment integration
- [ ] User dashboard with CV and analysis history
- [ ] Multi-language support (i18n)
- [ ] Job board integration

---

<div align="center">
  Built with ❤️ using React, NestJS, and Google Gemini AI
</div>
