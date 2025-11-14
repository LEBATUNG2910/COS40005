# 🧑‍💼 Modern Resume Builder — Landing Page & Web App

A clean, responsive, and animation-rich **Resume Builder application** built with **React + Vite**, **Tailwind CSS**, and **Framer Motion**.  
Includes a beautiful landing page, authentication flow, resume upload system, AI-powered tools, and an interactive template showcase.

---

## ✨ Features

### 🎯 Modern Landing Page  
A fully responsive landing page with smooth scroll-triggered animations:

- **Hero Section** — Animated headline + call-to-action buttons  
- **AI Resume Assistant** (`ai-section.jsx`)  
- **ATS Optimization Section** (`ats-section.jsx`)  
- **Career Tools Section** (`career-tools.jsx`)  
- **Testimonials & Social Proof** (`testimonials.jsx`, `social-proof.jsx`)  
- **Template Showcase Carousel** (`template-showcase.jsx`)  
- **Features & Footer** sections for extra branding  

---

### 🧠 AI-Powered Tools (Expandable)
The webapp includes or supports future AI integration:

- 📝 AI resume evaluation  
- 🎯 Keyword optimization for job descriptions  
- 📊 Score-based CV rating system  
- 🔍 AI job-match suggestions (planned)  

---

### 📄 Resume Template System  
Users can browse resume templates through an animated carousel:

- Modern, Minimalist, Dark Mode, Corporate themes  
- Pagination & swipe animations  
- High-quality template previews  
- Ready for future “Edit Template Online” upgrade  

---

### 🔐 Authentication System (`app/auth/`)
Included features:

- Login (`sign_in.jsx`)  
- Register (`sign_up.jsx`)  
- Clean UI & animations  
- Ready to connect with backend (NestJS / Node / Firebase / Supabase)  

---

### 📤 Resume Upload Flow (`app/upload/`)
A smooth upload interface:

- Drag-and-drop upload  
- Upload preview  
- Ready to integrate with AI text extraction  
- Supports PDF / DOCX  

---

## 🧱 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React + Vite** | Frontend framework & Dev tool |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Page & scroll animations |
| **Lucide Icons** | Clean SVG icons |
| **Context API / Custom Hooks** | Theme and UI state |
| **Shadcn/UI (optional)** | Component system |
| **PostCSS / Autoprefixer** | Styling pipeline |

---

## 🚀 Getting Started

### 1️⃣ Prerequisites  
- Node.js 18+  
- npm or yarn  

### 2️⃣ Installation  

```bash
# Clone the project
git clone https://github.com/your-username/your-repository.git
cd COS40005

# Install dependencies
npm install
# or
yarn install

src/
 ├── app/
 │    ├── home/
 │    │    └── home.jsx
 │    ├── auth/
 │    │    ├── sign_in.jsx
 │    │    └── sign_up.jsx
 │    └── upload/
 │         └── cv-upload.jsx
 │
 ├── assets/                 # Images, icons, illustrations
 │
 ├── components/
 │    ├── ui/                # Reusable UI components
 │    ├── ai-section.jsx
 │    ├── ats-section.jsx
 │    ├── career-tools.jsx
 │    ├── features.jsx
 │    ├── footer.jsx
 │    ├── header.jsx
 │    ├── hero.jsx
 │    ├── social-proof.jsx
 │    ├── template-showcase.jsx
 │    ├── testimonials.jsx
 │    └── theme-provider.jsx
 │
 ├── hooks/                  # Custom hooks
 ├── lib/                    # Utility functions
 ├── styles/                 # Global styles
 │
 ├── App.jsx
 ├── main.jsx
 └── index.css
