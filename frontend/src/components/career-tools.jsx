"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import pic5 from "../assets/pic5.png"

// --- SVG Icons for Tabs ---
// Using inline SVGs to match the design better than emojis
const ResumeIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const LetterIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const TargetIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

// --- Data for the component ---
const tools = [
  { name: "Resume Builder", icon: <ResumeIcon /> },
  { name: "Resume Checker", icon: <CheckIcon /> },
  { name: "Cover Letter Generator", icon: <LetterIcon /> },
  { name: "Job Tracker", icon: <TargetIcon /> },
];

const careerPaths = [
  {
    name: "Senior professionals & executives",
    image: "https://placehold.co/300x300/6366F1/FFFFFF?text=Senior",
    description:
      "Our layouts are designed for strategic impact—highlighting leadership, team performance, and business value. Build your CV in a single- or two-page format with tools like a board representation.",
    bullets: ["Managers", "Team leads", "Directors and above"],
  },
  {
    name: "First-time job seekers",
    image: "https://placehold.co/300x300/EC4899/FFFFFF?text=Entry",
    description:
      "Make a great first impression. Our templates help you focus on your skills, education, and projects, even if you don't have extensive work experience. We guide you on what to write.",
    bullets: ["Students", "Graduates", "Interns"],
  },
  {
    name: "Professionals seeking structure",
    image: "https://placehold.co/300x300/10B981/FFFFFF?text=Pro",
    description:
      "Get a clear, ATS-friendly structure that recruiters love. Our builder helps you organize your accomplishments and skills into a polished, easy-to-read document that stands out.",
    bullets: ["Career changers", "Mid-level", "Specialists"],
  },
  {
    name: "Creative professionals",
    image: "https://placehold.co/300x300/F59E0B/FFFFFF?text=Creative",
    description:
      "Showcase your portfolio and unique skills with a resume that's as creative as you are. Choose from modern layouts that let your personality and work shine through, without sacrificing professionalism.",
    bullets: ["Designers", "Writers", "Marketers"],
  },
];

// --- Main Component ---
export default function CareerTools() {
  const [activeTool, setActiveTool] = useState("Resume Builder");
  const [activePath, setActivePath] = useState(
    "Senior professionals & executives"
  );

  const currentPathData = careerPaths.find((p) => p.name === activePath);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- Top Section: All the career tools --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            All the career tools you need
          </h2>
        </motion.div>

        {/* Tools Tabs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16"
        >
          {tools.map((tool) => (
            <motion.button
              key={tool.name}
              variants={itemVariants}
              onClick={() => setActiveTool(tool.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors ${
                activeTool === tool.name
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tool.icon}
              {tool.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Tool Content (Shows Resume Builder content as per image) */}
        <motion.div
          key={activeTool} // Re-animate when tool changes
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            {/* Using a placeholder for the builder UI */}
            <img
              src={pic5}
              alt="Resume Builder"
              className="rounded-xl shadow-xl w-full"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              A feature-packed resume builder
            </h3>
            <p className="text-gray-600 mb-6">
              Easily edit your resume with Enhancv's drag-and-drop resume
              builder. Choose from different templates, various backgrounds and
              sections.
            </p>
            <button className="font-semibold text-indigo-600 hover:text-indigo-700">
              Build Your Resume →
            </button>
          </motion.div>
        </motion.div>

        {/* --- Dotted Separator --- */}
        <div
          className="my-24 h-16 bg-transparent"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, #d1d5db 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>

        {/* --- Bottom Section: For all career paths --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            For applicants across all career paths
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 relative">
          {/* Decorative Lines */}
          <svg
            className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-30 -z-10"
            fill="none"
            viewBox="0 0 100 100"
          >
            <path
              d="M10 80 C 30 20, 50 100, 70 50 S 90 0, 90 20"
              stroke="#8B5CF6"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="10" cy="80" r="3" fill="#10B981" />
            <circle cx="70" cy="50" r="3" fill="#6366F1" />
            <circle cx="90" cy="20" r="3" fill="#8B5CF6" />
          </svg>
          <svg
            className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-64 h-64 opacity-30 -z-10"
            fill="none"
            viewBox="0 0 100 100"
          >
            <path
              d="M10 20 C 30 80, 50 0, 70 50 S 90 100, 90 80"
              stroke="#8B5CF6"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="10" cy="20" r="3" fill="#6366F1" />
            <circle cx="70" cy="50" r="3" fill="#8B5CF6" />
            <circle cx="90" cy="80" r="3" fill="#10B981" />
          </svg>

          {/* Left Column: Path Selector & Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {careerPaths.map((path) => (
              <button
                key={path.name}
                onClick={() => setActivePath(path.name)}
                className={`flex items-center gap-3 p-3 w-full text-left rounded-lg transition-colors ${
                  activePath === path.name
                    ? "text-indigo-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`w-3 h-3 rounded-full ${
                    activePath === path.name
                      ? "bg-indigo-600"
                      : "bg-gray-300"
                  }`}
                ></span>
                <span className="font-semibold">{path.name}</span>
              </button>
            ))}
          </motion.div>

          {/* Right Column: Path Description */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="pt-3"
          >
            {currentPathData && (
              <motion.div
                key={currentPathData.name} // Re-animate when data changes
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-gray-600 mb-6 text-lg">
                  {currentPathData.description}
                </p>
                <ul className="space-y-2">
                  {currentPathData.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700 font-medium">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}