"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Briefcase, Wand2, CheckCircle, 
  LayoutTemplate, Paintbrush, Users, Download, ShieldCheck, 
  ArrowRight, Check, Quote, Edit3, Eye, Zap, TrendingUp, MessageSquare,
  Play, Clock, CheckCircle2, UploadCloud 
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

export default function ForOrganizations() {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "recruitment";

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20">
      {/* --- Tab Content --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {activeTab === "recruitment" && (
            <motion.div
              key="recruitment"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <RecruitmentContent />
            </motion.div>
          )}
          {activeTab === "higher-education" && (
            <motion.div
              key="higher-education"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <HigherEducationContent />
            </motion.div>
          )}
          {activeTab === "career-coaches" && (
            <motion.div
              key="career-coaches"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <CareerCoachesContent />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ==========================================
// NỘI DUNG TAB 1: FOR RECRUITMENT
// ==========================================
function RecruitmentContent() {
  return (
    <div className="space-y-32">
      {/* 1. Hero Section */}
      <section className="flex flex-col lg:flex-row items-center gap-12 pt-8">
        <div className="flex-1 space-y-6">
          <span className="text-xs font-semibold tracking-wider text-cyan-600 uppercase bg-cyan-50 px-3 py-1 rounded-full">
            For Recruitment & Consulting Companies
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            Deliver professional resumes fast, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">at scale.</span>
          </h1>
          <p className="text-lg text-gray-600">
            Tired of inconsistent, messy resumes and slow manual formatting? <br /><br />
            HireWise empowers your team to quickly create on-brand resumes that impress clients and land job interviews.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg shadow-cyan-500/30">
              Start 14-day Free Trial
            </button>
            <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition">
              Book a Demo
            </button>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="w-full aspect-square bg-gradient-to-tr from-cyan-50 to-white rounded-2xl border border-gray-100 shadow-2xl flex items-center justify-center p-8 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
             <div className="w-3/4 h-5/6 bg-white rounded-lg shadow-md border border-gray-200 p-4 relative z-10">
                <div className="w-1/2 h-4 bg-gray-200 rounded mb-4"></div>
                <div className="w-full h-2 bg-gray-100 rounded mb-2"></div>
                <div className="w-5/6 h-2 bg-gray-100 rounded mb-8"></div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-cyan-100 rounded-full"></div>
                  <div className="flex-1">
                     <div className="w-full h-2 bg-gray-100 rounded mb-2"></div>
                     <div className="w-full h-2 bg-gray-100 rounded mb-2"></div>
                     <div className="w-3/4 h-2 bg-gray-100 rounded"></div>
                  </div>
                </div>
             </div>
             <div className="absolute top-12 right-12 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full z-20 flex items-center gap-1 shadow-sm">
                <CheckCircle className="w-3 h-3" /> Accepted
             </div>
          </div>
        </div>
      </section>

      {/* 2. AI-powered resume automation */}
      <section className="bg-gray-900 rounded-3xl p-12 lg:p-20 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
        </div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-center mb-16">AI-powered resume automation</h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <FeatureCard 
              icon={<FileText className="w-6 h-6 text-cyan-400" />}
              title="One-click resume conversion"
              desc="Upload LinkedIn profiles, DOCX files, or PDFs, and turn them into stunning, on-brand resumes in seconds—no design skills needed."
              dark
            />
            <FeatureCard 
              icon={<Briefcase className="w-6 h-6 text-cyan-400" />}
              title="Match any job description"
              desc="Quickly tailor each resume to match specific roles or projects, ensuring your candidates always present the most relevant skills."
              dark
            />
            <FeatureCard 
              icon={<Wand2 className="w-6 h-6 text-cyan-400" />}
              title="AI-assisted content creation"
              desc="HireWise's AI assistant helps write impactful summaries, highlight key achievements, and tailor resumes based on keywords."
              dark
            />
            <FeatureCard 
              icon={<CheckCircle className="w-6 h-6 text-cyan-400" />}
              title="Always ATS-friendly"
              desc="Resumes pass through Applicant Tracking Systems with clean formatting, consistent structure, and proper keyword alignment."
              dark
            />
          </div>
        </div>
      </section>

      {/* 3. Why leading companies love HireWise */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-16 text-gray-900">Why leading companies love HireWise</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto mb-10">
          <FeatureCard 
            icon={<LayoutTemplate className="w-6 h-6 text-cyan-600" />}
            title="Job-ready templates"
            desc="Choose from over 40 professionally designed templates and tailor them to match your brand."
          />
          <FeatureCard 
            icon={<Paintbrush className="w-6 h-6 text-cyan-600" />}
            title="Custom-branded resumes"
            desc="Embed your agency's logo, colors, and tone into every resume. Keep your brand consistent across all candidates."
          />
          <FeatureCard 
            icon={<Users className="w-6 h-6 text-cyan-600" />}
            title="Team collaboration tools"
            desc="Enable multiple recruiters to work together through shared access and a centralized resume library."
          />
        </div>
        <div className="grid md:grid-cols-2 gap-10 max-w-3xl mx-auto">
          <FeatureCard 
            icon={<Download className="w-6 h-6 text-cyan-600" />}
            title="Unlimited downloads & versions"
            desc="Create, update, and export unlimited resumes and cover letters—perfect for high-volume roles."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-cyan-600" />}
            title="Enterprise-grade data protection"
            desc="We take privacy seriously. HireWise is fully GDPR-compliant, with all data stored in encrypted databases."
          />
        </div>
      </section>

      {/* 4. Testimonial */}
      <section className="bg-cyan-50/50 rounded-3xl p-12 text-center max-w-4xl mx-auto border border-cyan-100">
        <h2 className="text-2xl font-bold mb-8">Organizations agree HireWise is awesome</h2>
        <div className="flex flex-col md:flex-row items-center gap-8 text-left bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-24 h-24 shrink-0 bg-cyan-100 rounded-full overflow-hidden border-2 border-cyan-500">
            <img src={`https://ui-avatars.com/api/?name=Alla+R&background=06b6d4&color=fff`} alt="User" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-lg italic text-gray-700 mb-4">
              "HireWise makes it incredibly easy to create professional, well-structured CVs for our candidates. It saves us time and helps present their profiles in the best light."
            </p>
            <p className="font-semibold text-gray-900">— Alla R., Director of Talent Recruitment</p>
          </div>
        </div>
      </section>

      {/* 5. Pricing */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
          <p className="text-gray-500">Choose the plan that fits your organization's needs.</p>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto">
          <div className="flex-1 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition">
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-md uppercase">Career Coaching</span>
            <div className="mt-4 mb-6">
              <span className="text-4xl font-bold">€59</span><span className="text-gray-500"> / month</span>
              <p className="text-sm text-gray-500 mt-2">Perfect for solo recruiters or career coaches</p>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-gray-700">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-500" /> 1 active user</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-500" /> <b>Unlimited</b> resumes & cover letters</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-500" /> <b>Custom template</b> structure import</li>
              <li className="flex items-center gap-2 text-gray-400"><span className="w-4 h-4 flex items-center justify-center font-bold">×</span> Custom branding</li>
              <li className="flex items-center gap-2 text-gray-400"><span className="w-4 h-4 flex items-center justify-center font-bold">×</span> Priority support</li>
            </ul>
            <button className="w-full py-3 rounded-lg border border-cyan-500 text-cyan-600 font-semibold hover:bg-cyan-50 transition">
              Start My Coaching Plan
            </button>
          </div>

          <div className="flex-1 bg-white rounded-2xl p-8 border-2 border-cyan-500 shadow-xl relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              MOST POPULAR
            </div>
            <span className="bg-cyan-100 text-cyan-700 text-xs font-bold px-3 py-1 rounded-md uppercase flex items-center gap-1 w-max">
              <Briefcase className="w-3 h-3" /> Business
            </span>
            <div className="mt-4 mb-6">
              <span className="text-4xl font-bold">$125</span><span className="text-gray-500"> / month</span>
              <p className="text-sm text-gray-500 mt-2">Best for teams and agencies</p>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-gray-700">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-500" /> <b>Unlimited</b> active users</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-500" /> <b>Custom branding</b></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-500" /> <b>Unlimited</b> resumes & cover letters</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-500" /> <b>Custom template</b> structure import</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-500" /> <b>Priority support</b></li>
            </ul>
            <button className="w-full py-3 rounded-lg bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition shadow-lg shadow-cyan-500/30">
              Start My Business Plan
            </button>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently asked questions</h2>
        <div className="space-y-4">
          <FaqItem 
            question="What kinds of agencies use HireWise?" 
            answer="HireWise is used by a wide range of organizations that need to create professional resumes quickly and at scale. Among them are: Recruitment companies, Staffing and temp firms, Corporate talent acquisition teams, Job training programs, Universities, and Career transition services." 
            defaultOpen
          />
          <FaqItem question="Can we apply our branding to all resumes?" answer="Yes, the Business plan allows you to set up custom branding including your logo, brand colors, and specific fonts." />
          <FaqItem question="Are the resumes ATS-friendly?" answer="Absolutely. Our templates are specifically structured to be easily parsed by major Applicant Tracking Systems." />
          <FaqItem question="Can we import existing resumes?" answer="Yes, you can import DOCX or PDF files, or connect a LinkedIn profile to instantly generate a resume." />
          <FaqItem question="Is there a limit on the number of resumes we can create?" answer="On our Coaching and Business plans, you have unlimited resume and cover letter creation." />
        </div>
      </section>
    </div>
  );
}

// ==========================================
// NỘI DUNG TAB 2: HIGHER EDUCATION
// ==========================================
function HigherEducationContent() {
  return (
    <div className="space-y-32">
      {/* 1. Hero Section */}
      <section className="flex flex-col lg:flex-row items-center gap-12 pt-8">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-gray-900">
            Help More <br /> Students <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Get Hired, Fast</span>
          </h1>
          <p className="text-lg font-medium text-gray-800">
            A modern student experience with visibility your Career Center has never had.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Career Centers are expected to deliver employment outcomes without the data or staff to do it. HireWise gives you visibility into the job-search insights of your enrollments and the leverage to support more students without adding headcount.
          </p>
          <div className="pt-4 flex items-center gap-4">
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 shadow-lg shadow-cyan-500/30">
              Contact Us <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 text-sm text-gray-500 ml-4">
              <div className="flex -space-x-2">
                <img src="https://ui-avatars.com/api/?name=A&background=random" alt="Avatar" className="w-8 h-8 rounded-full border-2 border-white" />
                <img src="https://ui-avatars.com/api/?name=B&background=random" alt="Avatar" className="w-8 h-8 rounded-full border-2 border-white" />
                <img src="https://ui-avatars.com/api/?name=C&background=random" alt="Avatar" className="w-8 h-8 rounded-full border-2 border-white" />
              </div>
              <span>Loved by millions of students.</span>
            </div>
          </div>
        </div>
        <div className="flex-1 relative">
           <div className="w-full bg-gray-50 rounded-2xl border border-gray-100 shadow-2xl p-6 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-4">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Career Readiness</div>
                  <div className="flex gap-4">
                     <div className="h-12 w-1/3 bg-white border border-gray-200 rounded-lg"></div>
                     <div className="h-12 w-2/3 bg-white border border-gray-200 rounded-lg"></div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Engagement</div>
                    <div className="h-24 bg-white border border-gray-200 rounded-lg flex items-end p-2 gap-2">
                      <div className="w-1/4 h-1/2 bg-cyan-200 rounded-t-sm"></div>
                      <div className="w-1/4 h-3/4 bg-cyan-300 rounded-t-sm"></div>
                      <div className="w-1/4 h-full bg-cyan-500 rounded-t-sm"></div>
                      <div className="w-1/4 h-1/4 bg-gray-200 rounded-t-sm"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Active Majors</div>
                    <div className="h-24 bg-white border border-gray-200 rounded-lg p-3 space-y-2">
                       <div className="w-3/4 h-2 bg-gray-100 rounded"></div>
                       <div className="w-1/2 h-2 bg-gray-100 rounded"></div>
                       <div className="w-5/6 h-2 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-12 right-[-20px] bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-64 z-10 transform -rotate-2 hover:rotate-0 transition">
                 <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-cyan-500" />
                    <span className="font-bold text-gray-800 text-sm">Strategic Insight</span>
                 </div>
                 <p className="text-xs text-gray-600 mb-3">
                   <span className="text-red-500 font-bold">142 Seniors</span> are at risk (0 applications sent).
                 </p>
                 <button className="w-full bg-gray-900 text-white text-xs py-2 rounded font-medium flex justify-center items-center gap-2">
                    <MessageSquare className="w-3 h-3" /> Nudge Cohort
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* 2. Trusted By Section */}
      <section className="bg-gray-50/80 rounded-3xl p-8 lg:p-12 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Trusted by students worldwide & built with leading universities.
            </h2>
            <div className="flex gap-8">
              <div>
                <div className="text-2xl font-bold text-gray-900">500,000+</div>
                <div className="text-xs font-bold text-gray-500 tracking-wider uppercase">Resumes / Mo</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">Millions</div>
                <div className="text-xs font-bold text-gray-500 tracking-wider uppercase">Active Students</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">Global</div>
                <div className="text-xs font-bold text-gray-500 tracking-wider uppercase">Reach</div>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm w-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Shaped by Career Centers at</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['UC Irvine', 'Montclair State University', 'George Mason University', 'Southwest Minnesota State University', 'University of the People', 'Dartmouth College'].map(uni => (
                <span key={uni} className="bg-gray-50 border border-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-full font-medium">
                  {uni}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4 italic">+ Public, Private, & Online</p>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <h3 className="text-center text-xl font-bold text-gray-900 mb-8">What Career Services Leaders Are Saying</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard 
              quote="We don't know what students are actually doing unless they make an appointment. There's no visibility into the steps they take before or after."
              author="Mira B."
              role="Director of Career Services"
              university="University of the People"
            />
            <TestimonialCard 
              quote="The tools are good, but there needs to be something more fresh in this space for students."
              author="Brian Breen"
              role="Director of Employer Relations"
              university="Montclair State University"
            />
            <TestimonialCard 
              quote="I'm trying to get away from that transactional stuff in coaching. I want the coaching stuff to be transformational."
              author="Joe Catrino"
              role="Director of Career Design"
              university="Dartmouth College"
            />
          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
        <p className="text-gray-600 mb-12">Empower your students and gain visibility into their journey with a unified platform.</p>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto text-left">
          <HowItWorksCard 
            icon={<Edit3 className="w-5 h-5 text-white" />}
            title="Students Build Their Job Search"
            desc="They create and tailor resumes, run ATS checks, apply to relevant jobs, and prepare for interviews in a platform they already trust."
          >
             <div className="mt-6 flex gap-4 opacity-80 pointer-events-none">
                <div className="w-32 h-24 bg-white rounded-lg shadow-sm border border-gray-100 p-2 flex flex-col gap-2">
                   <div className="w-1/2 h-2 bg-gray-200 rounded"></div>
                   <div className="flex-1 bg-gray-50 rounded"></div>
                </div>
                <div className="w-40 h-24 bg-white rounded-lg shadow-sm border border-gray-100 p-3">
                   <div className="w-full h-2 bg-cyan-100 rounded mb-2"></div>
                   <div className="w-3/4 h-2 bg-cyan-100 rounded"></div>
                </div>
             </div>
          </HowItWorksCard>

          <HowItWorksCard 
            icon={<Eye className="w-5 h-5 text-white" />}
            title="You Gain Unprecedented Visibility"
            desc="See what students are actually doing. Track engagement, application behavior, and identify at-risk students before it's too late."
          >
             <div className="mt-6 space-y-2 opacity-80 pointer-events-none">
                {[1,2,3].map((i) => (
                  <div key={i} className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
                     <div className="w-6 h-6 rounded-full bg-cyan-50"></div>
                     <div className="w-1/2 h-2 bg-gray-100 rounded"></div>
                  </div>
                ))}
             </div>
          </HowItWorksCard>

          <HowItWorksCard 
            icon={<Zap className="w-5 h-5 text-white" />}
            title="Advisors Intervene Strategically"
            desc="Structured comments, version control, and prioritization tools let staff focus on high-impact coaching rather than administration."
          >
             <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-100 p-3 opacity-80 pointer-events-none w-3/4">
                <div className="flex justify-between items-center mb-3">
                  <div className="w-1/3 h-2 bg-gray-200 rounded"></div>
                  <div className="w-4 h-4 rounded-full bg-cyan-100"></div>
                </div>
                <div className="bg-red-50 p-2 rounded border border-red-100 mb-2">
                   <div className="w-1/2 h-2 bg-red-200 rounded"></div>
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-100">
                   <div className="w-2/3 h-2 bg-gray-200 rounded"></div>
                </div>
             </div>
          </HowItWorksCard>

          <HowItWorksCard 
            icon={<TrendingUp className="w-5 h-5 text-white" />}
            title="Leaders Track Real Outcomes"
            desc="Aggregated trends show readiness and placement. Data you can finally share with VPs, Provosts, and employer partners."
          >
             <div className="mt-6 flex items-end gap-2 h-24 opacity-80 pointer-events-none">
                <div className="bg-white p-2 rounded shadow-sm border border-gray-100 mb-auto">
                   <span className="text-xs text-gray-400 block mb-1">PLACEMENT RATE</span>
                   <span className="text-lg font-bold text-cyan-500">89%</span>
                </div>
                <div className="flex-1 flex items-end gap-2 h-full justify-end pb-2">
                   <div className="w-6 h-8 bg-gray-200 rounded-t"></div>
                   <div className="w-6 h-12 bg-cyan-200 rounded-t"></div>
                   <div className="w-6 h-16 bg-cyan-500 rounded-t"></div>
                </div>
             </div>
          </HowItWorksCard>
        </div>

        <div className="mt-12">
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-medium transition shadow-lg shadow-cyan-500/30">
            Start Your Pilot &rarr;
          </button>
        </div>
      </section>

      {/* 4. Big Quote Section */}
      <section className="bg-gray-900 rounded-3xl p-12 lg:p-24 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500 rounded-full mix-blend-multiply filter blur-[150px] opacity-30 translate-x-1/3 -translate-y-1/3"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <MessageSquare className="w-10 h-10 text-cyan-400 mb-8" />
          <h2 className="text-2xl md:text-3xl font-medium leading-relaxed mb-8">
            "Students struggle to translate their academic work into the language employers use. A platform that bridges coursework to market skills would help them compete more effectively."
          </h2>
          <div>
            <div className="font-bold text-lg">Mark Austin</div>
            <div className="text-gray-400 text-sm">George Mason University</div>
          </div>
        </div>
      </section>

      {/* 5. FAQ */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <FaqItem 
            question="How is this different from Handshake or VMock?" 
            answer="Handshake manages employers, job postings, and events. VMock focuses on resume scoring. HireWise supports the work that happens before any of that. It shows what students are actually doing in their job search, improves resume quality at scale, and gives advisors and leadership visibility into readiness and outcomes." 
            defaultOpen
          />
          <FaqItem question="Will this replace advisors or career coaches?" answer="No, it empowers them by reducing administrative burden and providing actionable data to make coaching sessions more impactful." />
          <FaqItem question="What data does the Career Center receive?" answer="Career Centers get real-time dashboards showing student engagement, resume completion rates, and application activity." />
          <FaqItem question="Do students need to learn another new tool?" answer="HireWise is designed with a consumer-grade interface that students find intuitive and easy to use without extensive training." />
          <FaqItem question="How quickly can we implement HireWise?" answer="Implementation typically takes 2-4 weeks depending on your IT setup and SSO requirements." />
          <FaqItem question="Do students pay?" answer="No, our Higher Education model is a B2B SaaS license paid by the institution." />
          <FaqItem question="Does this work for online, international, and adult learners?" answer="Yes, the platform is flexible and tailors content and recommendations to various student profiles." />
          <FaqItem question="Can we integrate this into courses or career modules?" answer="Absolutely. We offer LTI integrations for major LMS platforms like Canvas, Blackboard, and Moodle." />
          <FaqItem question="Can we run a pilot?" answer="Yes, we offer structured 1-semester pilots. Get in touch with our team to learn more." />
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="bg-gray-900 rounded-3xl p-16 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <svg className="absolute w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M-10,50 Q25,100 50,50 T110,50" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
            <path d="M-10,60 Q25,110 50,60 T110,60" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
            <path d="M-10,70 Q25,120 50,70 T110,70" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Get In Touch</h2>
          <p className="text-gray-300 mb-10 text-lg">
            HireWise for Career Centers is tailored to the size and needs of each institution. <br />
            To learn what a pilot or full implementation could look like for your campus, connect with our team.
          </p>
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-medium transition shadow-lg shadow-cyan-500/30 inline-flex items-center gap-2">
            Contact Us <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

// ==========================================
// SHARED / SUB-COMPONENTS
// ==========================================

function FeatureCard({ icon, title, desc, dark = false }) {
  return (
    <div className={`flex gap-4 text-left ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
      <div className={`shrink-0 p-3 rounded-xl h-fit ${dark ? 'bg-gray-800/50 border border-gray-700' : 'bg-cyan-50'}`}>
        {icon}
      </div>
      <div>
        <h3 className={`text-lg font-bold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        <p className="text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function FaqItem({ question, answer, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex w-full items-center justify-between text-left font-medium text-gray-900 hover:text-cyan-600 transition"
      >
        <span className="flex items-center gap-2">
           <span className="text-cyan-500">{isOpen ? '−' : '+'}</span> {question}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden text-gray-600 text-sm"
          >
            <p className="pt-4 pl-5 pb-2">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TestimonialCard({ quote, author, role, university }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full hover:shadow-md transition">
      <div>
        <Quote className="w-8 h-8 text-cyan-200 mb-6" />
        <p className="text-gray-700 text-sm leading-relaxed mb-8">"{quote}"</p>
      </div>
      <div>
        <div className="font-bold text-gray-900 text-sm">{author}</div>
        <div className="text-xs text-gray-500 mt-1">
          {role}, <span className="text-cyan-600 font-medium">{university}</span>
        </div>
      </div>
    </div>
  );
}

function HowItWorksCard({ icon, title, desc, children }) {
  return (
    <div className="bg-gray-50/50 rounded-2xl p-8 border border-gray-100 flex flex-col h-full overflow-hidden hover:bg-gray-50 transition">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-cyan-400 flex items-center justify-center shrink-0 shadow-sm">
          {icon}
        </div>
        <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
      </div>
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{desc}</p>
      <div className="mt-auto flex-1">
        {children}
      </div>
    </div>
  );
}

// ==========================================
// NỘI DUNG TAB 3: CAREER COACHES
// ==========================================
function CareerCoachesContent() {
  return (
    <div className="space-y-32">
      {/* 1. Hero Section */}
      <section className="flex flex-col lg:flex-row items-center gap-12 pt-8">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
            Cut your resume <br />
            creation time in half, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">deliver delightful ATS friendly resumes.</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Stop fighting with Word formatting. HireWise empowers you to import client resumes, apply stunning professional templates instantly, and free up your time to help more clients.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/process" className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg shadow-cyan-500/30">
              Start Free Trial
            </Link>
            <button className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition">
              See How It Works
            </button>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500 pt-2">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-cyan-500" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-cyan-500" /> ATS-Optimized</span>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="w-full aspect-square bg-gradient-to-tr from-cyan-50 to-white rounded-3xl border border-gray-100 shadow-2xl flex items-center justify-center p-8 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
             {/* Main Resume Mockup */}
             <div className="w-3/4 h-5/6 bg-white rounded-lg shadow-md border border-gray-200 p-4 relative z-10 overflow-hidden">
                <div className="w-1/2 h-4 bg-gray-200 rounded mb-4"></div>
                <div className="w-full h-2 bg-gray-100 rounded mb-2"></div>
                <div className="w-5/6 h-2 bg-gray-100 rounded mb-8"></div>
                <div className="flex gap-4 mb-4">
                  <div className="w-12 h-12 bg-cyan-100 rounded-full shrink-0"></div>
                  <div className="flex-1 space-y-2">
                     <div className="w-full h-2 bg-gray-100 rounded"></div>
                     <div className="w-full h-2 bg-gray-100 rounded"></div>
                     <div className="w-3/4 h-2 bg-gray-100 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                     <div className="w-full h-2 bg-gray-100 rounded"></div>
                     <div className="w-5/6 h-2 bg-gray-100 rounded"></div>
                </div>
             </div>
             {/* Floating UI Elements */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center z-20">
                <Wand2 className="w-8 h-8 text-cyan-500" />
             </div>
             <div className="absolute top-8 right-8 bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full z-20 flex items-center gap-1.5 shadow-sm">
                <CheckCircle className="w-3.5 h-3.5" /> Accepted
             </div>
             <div className="absolute bottom-12 left-8 bg-white text-gray-700 text-xs font-bold px-4 py-2 rounded-lg z-20 shadow-lg border border-gray-100">
                Upload logo
             </div>
          </div>
        </div>
      </section>

      {/* 2. Step-by-Step Guide (Replaced Video Section) */}
      <section className="bg-gray-50/80 rounded-3xl p-12 lg:p-20 border border-gray-100">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Streamline your workflow in 3 simple steps</h2>
          <p className="text-gray-600 text-lg">
            From messy Word documents to polished, ATS-ready resumes in a fraction of the time. Here is how HireWise works for you and your clients.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          {/* Đường gạch ngang kết nối các bước (Chỉ hiện trên giao diện Desktop) */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-cyan-200/50 z-0"></div>

          {/* Step 1 */}
          <div className="relative z-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
            <div className="absolute top-4 right-4 text-5xl font-black text-gray-50 group-hover:text-cyan-50 transition-colors pointer-events-none">
              01
            </div>
            <div className="w-16 h-16 mx-auto bg-cyan-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm border border-cyan-100">
              <UploadCloud className="w-7 h-7 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">Import Client Data</h3>
            <p className="text-gray-600 text-sm leading-relaxed relative z-10">
              Upload existing DOCX, PDF files, or sync directly from their LinkedIn profile. We'll automatically extract and structure the information.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
            <div className="absolute top-4 right-4 text-5xl font-black text-gray-50 group-hover:text-cyan-50 transition-colors pointer-events-none">
              02
            </div>
            <div className="w-16 h-16 mx-auto bg-cyan-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm border border-cyan-100">
              <Wand2 className="w-7 h-7 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">Optimize with AI</h3>
            <p className="text-gray-600 text-sm leading-relaxed relative z-10">
              Use our AI to overcome writer's block. Rewrite summaries, match keywords to specific job descriptions, and apply professional templates.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
            <div className="absolute top-4 right-4 text-5xl font-black text-gray-50 group-hover:text-cyan-50 transition-colors pointer-events-none">
              03
            </div>
            <div className="w-16 h-16 mx-auto bg-cyan-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm border border-cyan-100">
              <Download className="w-7 h-7 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">Export & Deliver</h3>
            <p className="text-gray-600 text-sm leading-relaxed relative z-10">
              Download a flawless, ATS-friendly PDF. Share drafts directly with your clients for feedback and final approval in record time.
            </p>
          </div>
        </div>
      </section>

      {/* 3. AI Features (Reuse dark section style) */}
      <section className="bg-gray-900 rounded-3xl p-12 lg:p-20 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
        </div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-center mb-16">AI-powered resume automation</h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <FeatureCard 
              icon={<FileText className="w-6 h-6 text-cyan-400" />}
              title="One-click resume conversion"
              desc="Upload clients' LinkedIn profiles, DOCX files, or PDFs, and turn them into stunning, on-brand resumes in seconds—no design skills needed."
              dark
            />
            <FeatureCard 
              icon={<Briefcase className="w-6 h-6 text-cyan-400" />}
              title="Match any job description"
              desc="Quickly tailor each resume to match specific roles or projects, ensuring your candidates always present the most relevant skills."
              dark
            />
            <FeatureCard 
              icon={<Wand2 className="w-6 h-6 text-cyan-400" />}
              title="AI-assisted content creation"
              desc="Writer's block? Our AI assistant helps write impactful summaries, highlight key achievements, and tailor resumes based on keywords."
              dark
            />
            <FeatureCard 
              icon={<CheckCircle className="w-6 h-6 text-cyan-400" />}
              title="Always ATS-friendly"
              desc="Resumes pass through Applicant Tracking Systems with clean formatting, consistent structure, and proper keyword alignment."
              dark
            />
          </div>
        </div>
      </section>

      {/* 4. Why solo experts love HireWise */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-16 text-gray-900">Why solo experts love HireWise</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <FeatureCard 
            icon={<LayoutTemplate className="w-6 h-6 text-cyan-600" />}
            title="Coach-Verified Templates"
            desc="Choose from over 15 professionally designed templates proven to work for executive positions in high-stake industries like Tech, Finance, Marketing and Law."
          />
          <FeatureCard 
            icon={<Clock className="w-6 h-6 text-cyan-600" />}
            title="Time-Saving Automation"
            desc="Stop tweaking margins and fonts manually. Our engine formats content perfectly every time, saving you 2+ hours per client."
          />
          <FeatureCard 
            icon={<Users className="w-6 h-6 text-cyan-600" />}
            title="Client Collaboration"
            desc="Invite clients to comment on drafts directly in the platform, streamlining feedback and getting them to 'final' faster."
          />
        </div>
      </section>

      {/* 5. Testimonial */}
      <section className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12 text-left bg-white p-2 border-b border-gray-200 pb-12">
          <div className="w-48 h-48 shrink-0 bg-cyan-50 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
            <div className="absolute inset-0 bg-cyan-200/50 mix-blend-multiply"></div>
            <img src={`https://ui-avatars.com/api/?name=Marcus+Thorne&background=f1f5f9&color=0f172a`} alt="User" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Coaches agree: HireWise is a game-changer</h2>
            <div className="border-t-2 border-cyan-100 pt-6">
                <p className="text-lg italic text-gray-700 mb-6 font-medium leading-relaxed">
                "I used to turn away potential clients because I couldn't keep up with the formatting work. HireWise simplified my workflow so much I've increased my revenue by 40% without working extra hours."
                </p>
                <p className="font-bold text-gray-900 text-sm tracking-wide">— Marcus Thorne, Executive Resume Writer</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Single Pricing Card Section */}
      <section className="relative rounded-3xl overflow-hidden py-24 px-4 bg-gray-900 text-center border border-gray-100">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80')] bg-cover bg-center opacity-20 mix-blend-luminosity grayscale"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-sm mx-auto">
          <h2 className="text-3xl font-bold text-white mb-10">Simple, transparent pricing</h2>
          
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-left transform hover:-translate-y-1 transition duration-300">
            <span className="bg-cyan-100 text-cyan-800 text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wide">
              Career Coaching
            </span>
            <div className="mt-6 mb-6">
              <span className="text-5xl font-extrabold text-gray-900">€59</span><span className="text-gray-500 font-medium"> / month</span>
              <p className="text-sm text-gray-500 mt-3 font-medium">Perfect for solo recruiters or career coaches</p>
            </div>
            
            <div className="flex gap-4 border-b border-gray-100 pb-4 mb-6">
               <button className="text-sm font-bold border-b-2 border-cyan-500 text-cyan-600 pb-1">Monthly</button>
               <button className="text-sm font-medium text-gray-400 pb-1">Yearly</button>
            </div>

            <ul className="space-y-4 mb-8 text-sm text-gray-700 font-medium">
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-cyan-500" /> <b>Unlimited</b> clients</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-cyan-500" /> <b>Unlimited</b> resumes & cover letters</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-cyan-500" /> <b>Custom template</b> structure you can import into</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-cyan-500" /> AI Editing & Content Analyzer</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-cyan-500" /> Easy collaboration with the client</li>
            </ul>
            <button className="w-full py-3.5 rounded-lg bg-cyan-500 text-white font-bold hover:bg-cyan-600 transition shadow-lg shadow-cyan-500/30 text-base">
              Start My Coaching Plan
            </button>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently asked questions</h2>
        <div className="space-y-4">
          <FaqItem 
            question="What formats can I export resumes in?" 
            answer="You can export all resumes in PDF. Our PDFs are optimized for ATS readability, ensuring your client's application gets seen by recruiters." 
            defaultOpen
          />
          <FaqItem question="Is there a limit on how many clients I can manage?" answer="No, our Career Coaching plan allows you to manage an unlimited number of clients." />
          <FaqItem question="Are the resumes ATS-friendly?" answer="Absolutely. Our templates are specifically structured to be easily parsed by major Applicant Tracking Systems." />
          <FaqItem question="Can I import existing resumes?" answer="Yes, you can easily import your clients' existing DOCX or PDF resumes, or sync directly from their LinkedIn profiles to generate a structured baseline instantly." />
        </div>
      </section>
    </div>
  );
}