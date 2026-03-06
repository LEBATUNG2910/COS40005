"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom"; 

const faqData = [
  {
    question: "Why use HIREWISE for your job application?",
    answer: (
      <div className="space-y-4">
        <p>
          HIREWISE helps you build a resume that feels personal and gets
          remembered. It's modern, intuitive, and makes the process surprisingly
          enjoyable. With expert guidance at every step, you can highlight your
          skills, achievements, and personality.
        </p>
        <p>Here's what you get:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            A drag-and-drop resume builder with professional{" "}
            <Link to="/templates" className="text-cyan-600 hover:underline">
              resume templates
            </Link>{" "}
            for every career level.
          </li>
          <li>
            A{" "}
            <Link to="/cover-letter" className="text-cyan-600 hover:underline">
              cover letter builder
            </Link>{" "}
            with matching templates.
          </li>
          <li>
            Ready-to-use resume examples written by career experts.
          </li>
          <li>Built-in resume text improvements and proofing tools.</li>
          <li>
            A set of AI features that empower your resume creation, including a
            smart AI assistant.
          </li>
          <li>
            One-click resume tailoring to match your application to the job
            description.
          </li>
          <li>
            A free{" "}
            <Link to="/resume-checker" className="text-cyan-600 hover:underline">
              resume checker
            </Link>{" "}
            that flags issues and improves ATS compatibility.
          </li>
          <li>
            A job application tracker that also analyzes your resume score.
          </li>
          <li>Download options in PDF or TXT.</li>
          <li>Cloud storage for your documents.</li>
        </ul>
        <p>
          Still unsure? Read our{" "}
          <Link to="/reviews" className="text-cyan-600 hover:underline">
            reviews
          </Link>{" "}
          to see how HIREWISE helped others land dream jobs.
        </p>
      </div>
    ),
  },
  {
    question: "Is HIREWISE free to use?",
    answer: (
      <p>
        Yes, HIREWISE offers a free plan with basic features, including access
        to our core CV builder and free templates. We also offer a Pro plan
        with advanced AI features, premium templates, and our Skill Roadmap feature.
      </p>
    ),
  },
  {
    question: "How can I contact HIREWISE if I have any questions?",
    answer: (
      <p>
        You can reach our customer support team 24/7 via our contact page or by
        emailing support@hirewise.com. We're always happy to help!
      </p>
    ),
  },
  {
    question: "What are HIREWISE's AI tools?",
    answer: (
      <p>
        Our AI tools include an AI Content Writer, an AI Resume Grader, an
        AI Keyword Matcher, and our unique AI Skill Roadmap generator that helps
        you identify and learn missing skills.
      </p>
    ),
  },
  {
    question: "Do you support languages outside of English?",
    answer: (
      <p>
        Currently, our platform is optimized for English. We are working on
        adding support for other languages in the near future.
      </p>
    ),
  },
  {
    question: "Is HIREWISE ATS-friendly?",
    answer: (
      <p>
        Absolutely. All of our templates are designed to be fully ATS-friendly
        (Applicant Tracking System). Our AI Resume Checker will even score your
        resume's ATS compatibility and tell you how to improve it.
      </p>
    ),
  },
  {
    question: "How to use the HIREWISE Resume Builder?",
    answer: (
      <p>
        Just follow the simple steps! 1. Choose a template (or upload your
        own). 2. Our builder will guide you section by section. 3. Use our AI
        tools to write and optimize your content. 4. Download your new resume!
      </p>
    ),
  },
  {
    question: "Should my resume be in PDF or Word format?",
    answer: (
      <p>
        We strongly recommend PDF. It maintains perfect formatting across all
        devices and is preferred by almost all recruiters and ATS systems. Our
        builder exports directly to PDF.
      </p>
    ),
  },
  {
    question: "Should I send a cover letter with my resume?",
    answer: (
      <p>
        Yes, you should! Unless the job description specifically says not to.
        A well-written cover letter shows you are serious about the role. You
        can use our AI Cover Letter Generator to create one that matches your
        resume.
      </p>
    ),
  },
  {
    question: "Does HIREWISE offer business plans for organizations?",
    answer: (
      <p>
        Yes, we do. We offer "HIREWISE for Universities" and "HIREWISE for
        Business" plans. Please visit our "For Organizations" page or contact
        our sales team for more details.
      </p>
    ),
  },
];

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={onClick}
        className="flex items-start gap-4 w-full py-4 text-left group"
      >
        <div className={`mt-1 transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : "rotate-0"}`}>
          {isOpen ? (
            <Minus className="w-4 h-4 text-cyan-600" strokeWidth={2.5} />
          ) : (
            <Plus className="w-4 h-4 text-gray-400 group-hover:text-cyan-600" strokeWidth={2.5} />
          )}
        </div>
        
        <span
          className={`text-base font-medium transition-colors ${
            isOpen ? "text-cyan-600" : "text-gray-800 group-hover:text-cyan-600"
          }`}
        >
          {question}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-5 pl-8 pr-4 text-sm text-gray-500 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null); 

  const handleItemClick = (index) => {
    setOpenIndex(openIndex === index ? null : index); 
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Frequently asked questions about HIREWISE
          </h2>
          <p className="text-gray-500 text-sm">Find answers to common questions about our platform.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          {faqData.map((item, index) => (
            <AccordionItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => handleItemClick(index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}