# 🧑‍💼 HireWise — AI-Powered Resume Builder

> A full-stack, production-ready **Resume Builder Web Application** built with **React + Vite** on the frontend and **NestJS** on the backend. Features AI-powered CV analysis using **Google Gemini**, smart job-matching with the **BM25 algorithm**, JWT-based authentication, PDF extraction, and a polished UI with animations.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Live Features](#-live-features)
- [Architecture](#-architecture)
- [Frontend](#-frontend)
- [Backend](#-backend)
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
Register / Login → Upload CV (PDF) → Choose Template → Paste Job Description → Get AI Analysis + Match Score
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

- **BM25 Match Score** (0–99) — measures textual overlap between CV and JD using the BM25 ranking algorithm, combined with a skill-match ratio (50/50 weighting + bonus for high skill coverage)
- **Skills in Your CV** — extracted from a curated list of 60+ tech keywords
- **Missing Skills** — skills mentioned in JD but absent from CV
- **AI Assessment** (Gemini) — personalized 2–3 sentence overall feedback
- **Strengths** — 3 specific strengths identified by AI from the actual CV content
- **Areas to Improve** — 2 specific weaknesses with actionable advice
- **Learning Roadmap** — 3 skill suggestions, each with 3 curated learning resources (Roadmap.sh, FreeCodeCamp, Udemy/YouTube)

---

### 📄 Resume Upload (`/upload`)
Drag-and-drop CV upload interface:

- Accepts **PDF only** (max 10MB)
- Backend extracts full text using `pdftotext` (poppler) with fallback to `pdf-parse`
- Displays upload progress bar
- Extracted text stored server-side, linked to authenticated user
- Supports re-upload to replace existing CV

---

### 🖼️ Template Selection (`/selection`)
Browse and select from **12 professionally designed** resume templates:

- Animated grid with hover effects (`framer-motion`)
- Templates: Double Column, Ivy League, Elegant, Contemporary, Polished, Modern, Creative, Timeline, Stylish, Single Column, Elegant with Logos, Double Column with Logos
- Selected template ID saved to Context and passed to the backend on upload
- Selection confirmed via a floating "Continue" button

---

### 👤 Account Page (`/account`)
Profile management with sidebar navigation (inspired by Enhancv):

- **Your Profile tab** — edit full name, language preference, newsletter opt-in
- **Email display** — read-only with "Change Email Address" link
- **Password change** — modal with current/new/confirm fields, show/hide toggle, backend validation
- **Account actions** — Sign Out of All Devices, Delete Account
- **Billing tab** — Pro upgrade card with monthly/yearly toggle and feature list
- All changes persisted to backend via `PATCH /api/auth/profile`

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND (React)                   │
│  Landing → Auth → Upload → Template → Analyst → Account │
└──────────────────────┬──────────────────────────────┘
                       │ REST API (fetch)
                       │ Authorization: Bearer <JWT>
┌──────────────────────▼──────────────────────────────┐
│                   BACKEND (NestJS)                    │
│                                                       │
│  AuthModule  ──→  JWT Sign/Verify  ──→  UsersService  │
│  CvModule    ──→  PDF Extract      ──→  CvStore (Map) │
│              ──→  BM25 Engine      ──→  Score         │
│              ──→  Gemini API       ──→  AI Analysis   │
└─────────────────────────────────────────────────────┘
```

> **Note:** CV data is currently stored **in-memory** (`Map<userId, CvRecord>`). Data resets on server restart. A database (PostgreSQL/MongoDB) integration is planned for production.

---

## 🖥️ Frontend

### Pages & Routing

| Route | Component | Description |
|---|---|---|
| `/` | `home.jsx` | Landing page with all sections |
| `/auth` | `sign_in.jsx` / `sign_up.jsx` | Login and Register |
| `/upload` | `cv-upload.jsx` | CV upload (Step 1) |
| `/selection` | `ResumeTemplateSelection.jsx` | Template picker (Step 2) |
| `/analyst` | `page.jsx` | CV analysis dashboard (Step 3) |
| `/account` | `account.jsx` | User profile & settings |
| `/process` | `HowItWork.jsx` | Entry point / onboarding |
| `/resource` | `Resource.jsx` | Blog / resources |

### 3-Step Progress Indicator
All 3 core pages (Upload → Template → Analyze) share a consistent step indicator:
- Emerald green circles, checkmark for completed steps
- Step label below each circle
- Consistent white background layout across all steps

### State Management
Global state via **React Context API** (`FileContext`):
```js
{
  uploadedFile: File | null,       // the uploaded PDF file object
  selectedTemplateId: number | null // chosen template ID
}
```

---

## ⚙️ Backend

Built with **NestJS**, running on port `3001`.

### Modules

#### `AuthModule`
| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/register` | POST | Create new account (fullName, email, phone, password, gender) |
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
```
1. Try pdftotext (poppler) — best quality, preserves layout
   Paths checked: /opt/homebrew/bin, /usr/local/bin, /usr/bin, PATH
2. Fallback to pdf-parse (npm) — pure JS, works everywhere
3. If both fail → throw BadRequestException
```

---

## 🤖 AI & Matching Engine

### BM25 Algorithm (`calculateBM25Score`)

A modified BM25 implementation optimized for **single-document matching** (1 CV vs 1 JD):

```
Parameters: k1 = 1.5, b = 0.75
avgdl = cvTokens.length  (no cross-document length penalty)

For each unique term in JD:
  if term exists in CV:
    bm25(term) = f(t,d) × (k1 + 1) / (f(t,d) + k1 × (1 - b + b × |CV|/avgdl))

bm25Score = Σ bm25(term) / maxPossible
```

**Scoring formula (hybrid):**
```
skillMatchRatio = matched_skills / total_jd_skills

combined    = bm25Score × 0.5 + skillMatchRatio × 0.5
bonus       = skillMatchRatio ≥ 0.8 ? (skillMatchRatio - 0.8) × 0.5 : 0
finalScore  = min(combined + bonus, 1) × 100
```

This gives a realistic score: a CV with 100% skill match scores **~74+** instead of the previous 58.

### Gemini AI Integration

Model: `gemini-2.5-flash-lite` via REST API

The prompt instructs Gemini to act as a senior technical recruiter and return **strictly valid JSON**:

```json
{
  "strengths": ["...", "...", "..."],
  "weaknesses": ["...", "..."],
  "suggestions": [
    {
      "skill": "Docker",
      "reason": "...",
      "resources": [
        { "name": "...", "url": "https://roadmap.sh/docker", "type": "free", "platform": "Roadmap.sh" },
        { "name": "...", "url": "https://freecodecamp.org/...", "type": "free", "platform": "FreeCodeCamp" },
        { "name": "...", "url": "https://udemy.com/...", "type": "paid", "platform": "Udemy" }
      ]
    }
  ],
  "overallFeedback": "..."
}
```

**Robustness features:**
- Strips markdown code fences (` ```json `) before parsing
- Extracts JSON by finding first `{` and last `}`
- Falls back to curated static resources if Gemini fails or returns empty
- Always guarantees 3 suggestions even when no skills are missing

---

## 🔐 Authentication

JWT-based auth with two token durations:

| Mode | Token Expiry | Storage |
|---|---|---|
| Normal login | `JWT_EXPIRES_IN` (e.g. `100y`) | `sessionStorage` |
| Remember Me | `JWT_REMEMBER_EXPIRES_IN` (e.g. `100y`) | `localStorage` |

**`authService` (frontend):**
```js
authService.getToken()     // checks localStorage then sessionStorage
authService.saveToken(token, rememberMe)
authService.logout()       // clears both storages
```

**Header behavior:**
- **Not logged in** → User icon shows Sign In / Sign Up
- **Logged in** → User icon shows Account / Logout
- Logout triggers a 900ms loading overlay, then redirects to `/`

---

## 🧱 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18+ | UI framework |
| Vite | 5+ | Build tool & dev server |
| Tailwind CSS | 3+ | Utility-first styling |
| Framer Motion | 10+ | Page & scroll animations |
| Lucide React | 0.3+ | SVG icon library |
| React Router DOM | 6+ | Client-side routing |
| Shadcn/UI | latest | Card, Button, Input components |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| NestJS | 10+ | Backend framework |
| JWT / Passport | — | Authentication |
| bcryptjs | — | Password hashing |
| Multer | — | File upload handling |
| pdf-parse | — | PDF text extraction (fallback) |
| poppler (pdftotext) | — | PDF text extraction (primary) |
| ConfigService | — | Environment variable management |

### External APIs
| Service | Purpose |
|---|---|
| Google Gemini API (`gemini-2.5-flash-lite`) | AI CV analysis and suggestions |

---

## 📁 Project Structure

```
COS40005/
│
├── frontend/                          # React + Vite app
│   └── src/
│       ├── app/
│       │   ├── home/
│       │   │   └── home.jsx           # Landing page
│       │   ├── auth/
│       │   │   ├── sign_in.jsx        # Login page
│       │   │   └── sign_up.jsx        # Register page
│       │   ├── upload/
│       │   │   └── cv-upload.jsx      # CV upload (Step 1)
│       │   ├── selection/
│       │   │   └── ResumeTemplateSelection.jsx  # Template picker (Step 2)
│       │   ├── analyst/
│       │   │   └── page.jsx           # CV analysis dashboard (Step 3)
│       │   └── account/
│       │       └── account.jsx        # User profile & settings
│       │
│       ├── components/
│       │   ├── ui/                    # Shadcn/UI base components
│       │   ├── header.jsx             # Global nav with auth-aware dropdown
│       │   ├── hero.jsx               # Hero section
│       │   ├── ai-section.jsx         # AI features showcase
│       │   ├── ats-section.jsx        # ATS optimization section
│       │   ├── career-tools.jsx       # Career tools overview
│       │   ├── template-showcase.jsx  # Template carousel
│       │   ├── testimonials.jsx       # User reviews
│       │   ├── social-proof.jsx       # Stats & trust signals
│       │   ├── features.jsx           # Feature grid
│       │   └── footer.jsx             # Footer
│       │
│       ├── context/
│       │   └── FileContext.jsx        # Global state (file + templateId)
│       │
│       ├── services/
│       │   └── authService.js         # Token management (get/save/logout)
│       │
│       ├── assets/                    # Images, template previews (pic9–pic20)
│       ├── hooks/                     # Custom React hooks
│       ├── lib/                       # Utility functions
│       └── App.jsx                    # Route definitions
│
└── backend/                           # NestJS app (port 3001)
    └── src/
        ├── auth/
        │   ├── auth.controller.ts     # Auth endpoints
        │   ├── auth.service.ts        # Business logic, JWT signing
        │   └── jwt.strategy.ts        # Passport JWT strategy
        ├── cv/
        │   ├── cv.controller.ts       # CV endpoints
        │   └── cv.service.ts          # PDF extraction, BM25, Gemini
        ├── users/
        │   └── users.service.ts       # User CRUD
        └── main.ts                    # Bootstrap, CORS config
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- poppler (for best PDF extraction quality)

```bash
# macOS
brew install poppler

# Ubuntu/Debian
sudo apt-get install poppler-utils
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Backend Setup

```bash
cd backend
npm install
npm run start:dev
# → http://localhost:3001
```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:

```dotenv
PORT=3001
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=100y
JWT_REMEMBER_EXPIRES_IN=100y
GEMINI_API_KEY=your_gemini_api_key_here
```

> Get a free Gemini API key at [https://aistudio.google.com](https://aistudio.google.com)

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
POST   /api/cv/upload          # multipart/form-data: file, templateId
GET    /api/cv/me              # returns CV metadata + preview text
GET    /api/cv/preview         # streams the original PDF
POST   /api/cv/analyze         # body: { jobDescription: string }
```

**Sample analyze response:**
```json
{
  "fileName": "my-cv.pdf",
  "matchScore": 74,
  "cvSkills": ["react", "nodejs", "docker", "postgresql"],
  "jdSkills": ["react", "nodejs", "docker", "postgresql", "kubernetes"],
  "missingSkills": ["kubernetes"],
  "aiAnalysis": {
    "strengths": ["..."],
    "weaknesses": ["..."],
    "suggestions": [{ "skill": "...", "reason": "...", "resources": [] }],
    "overallFeedback": "..."
  }
}
```

---

## 🗺️ Roadmap

- [ ] Persist CV data to PostgreSQL (replace in-memory Map)
- [ ] Refresh token implementation
- [ ] Online resume editor (fill template in-browser)
- [ ] Export resume as PDF from selected template
- [ ] Multi-language support (i18n)
- [ ] Job board integration (LinkedIn / Indeed scraping)
- [ ] AI cover letter generator

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

<div align="center">
  Built with ❤️ using React, NestJS, and Google Gemini AI
</div>
