"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  Search,
  Sparkles,
  Target,
} from "lucide-react";

const resources = [
  {
    icon: FileText,
    title: "Resume Writing",
    text: "Build role-focused resumes that align with ATS and recruiter expectations.",
    path: "/process",
    cta: "Learn Resume Process",
  },
  {
    icon: BriefcaseBusiness,
    title: "Interview Prep",
    text: "Practice structured answers and improve confidence with practical frameworks.",
    path: "/resource",
    cta: "Read Interview Tips",
  },
  {
    icon: Search,
    title: "Job Search Strategy",
    text: "Organize applications, prioritize opportunities, and track your progress.",
    path: "/organize",
    cta: "Explore Planning Tools",
  },
];

const tools = [
  {
    title: "Upload CV",
    path: "/upload",
    description: "Start from your existing resume in seconds.",
  },
  {
    title: "CV Analyst",
    path: "/analyst",
    description: "Get quick feedback and actionable improvements.",
  },
  {
    title: "Template Selection",
    path: "/selection",
    description: "Choose a modern, recruiter-ready design.",
  },
];

function CareerCenterPage() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-100 via-blue-100 to-purple-100 opacity-25" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold bg-cyan-100 text-cyan-700 rounded-full px-3 py-1.5">
              <GraduationCap className="w-3.5 h-3.5" /> Career Center
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900">
              Everything you need to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                {" "}
                land your next role
              </span>
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              Access practical career resources, guided tools, and AI-driven
              support from first draft to final offer.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {resources.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{item.text}</p>
                <Link
                  to={item.path}
                  className="inline-block mt-5 text-sm font-medium text-cyan-600 hover:text-cyan-700"
                >
                  {item.cta}
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-2xl font-bold text-gray-900">Career tools</h2>
            <p className="mt-2 text-gray-600">
              Use your HireWise toolkit to improve faster with focused actions.
            </p>
            <div className="mt-5 space-y-3">
              {tools.map((tool) => (
                <Link
                  key={tool.title}
                  to={tool.path}
                  className="block rounded-xl border border-gray-200 p-4 hover:border-cyan-300 transition"
                >
                  <p className="font-semibold text-gray-900">{tool.title}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-cyan-50 to-blue-50 p-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Focused path to results
            </h2>
            <div className="mt-5 space-y-4 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-500" /> Build a targeted
                resume for each role.
              </p>
              <p className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-500" /> Apply AI
                suggestions to strengthen impact.
              </p>
              <p className="flex items-center gap-2">
                <BriefcaseBusiness className="w-4 h-4 text-cyan-500" /> Prepare
                for interviews with confidence.
              </p>
            </div>
            <Link to="/auth">
              <button className="mt-7 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition">
                Start Your Career Plan
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CareerCenterPage;
