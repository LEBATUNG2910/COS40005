"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Zap,
  FileText,
  BarChart3,
  Share2,
  ArrowRight,
} from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: FileText,
      title: "1. Choose Your Template",
      description:
        "Select from 20+ professionally designed resume templates tailored for different industries and career levels.",
      features: [
        "ATS-optimized designs",
        "Modern & creative layouts",
        "Easy to customize",
      ],
    },
    {
      icon: Zap,
      title: "2. Use AI-Powered Builder",
      description:
        "Our intelligent resume builder guides you through each section with AI suggestions and real-time improvements.",
      features: [
        "Smart suggestions",
        "Real-time grammar check",
        "Content optimization",
      ],
    },
    {
      icon: BarChart3,
      title: "3. Customize Your Design",
      description:
        "Personalize colors, fonts, sections, and layout to match your style while maintaining ATS compatibility.",
      features: [
        "Custom colors & fonts",
        "Flexible layouts",
        "Multiple page options",
      ],
    },
    {
      icon: CheckCircle,
      title: "4. Optimize for ATS",
      description:
        "Ensure your resume passes Applicant Tracking Systems with our built-in ATS checker and formatting tools.",
      features: ["ATS scoring", "Format validation", "Keyword optimization"],
    },
    {
      icon: Share2,
      title: "5. Download & Share",
      description:
        "Export your resume as PDF or share directly with employers. Track your resume's performance.",
      features: ["Multiple formats", "Direct sharing", "Performance tracking"],
    },
  ];

  const benefits = [
    { icon: "✓", text: "Save hours on resume building" },
    { icon: "✓", text: "Increase interview callback rates" },
    { icon: "✓", text: "Get hired faster with optimized content" },
    { icon: "✓", text: "Cover letters generator included" },
    { icon: "✓", text: "Unlimited resume updates" },
    { icon: "✓", text: "Career coaching resources" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    // Updated main background
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          {/* Updated text colors */}
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            How to Build Your Perfect Resume
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Follow these 5 simple steps to create a professional resume that gets
            you noticed by employers
          </p>
        </motion.div>

        {/* Steps Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                // Updated card background
                className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg hover:shadow-2xl transition-shadow p-8 border border-white/10"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="flex-shrink-0"
                  >
                    {/* Icon background already matches */}
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                  </motion.div>
                  <div className="flex-grow">
                    {/* Updated text colors */}
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 mb-4">{step.description}</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {step.features.map((feature, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                          // Updated text color
                          className="flex items-center gap-2 text-sm text-gray-200"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        // Updated benefits background
        className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            // Updated text color
            className="text-4xl font-bold text-center text-white mb-16"
          >
            Why Choose HIREWISE?
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                // Updated benefit card background
                className="bg-white/5 backdrop-blur-md rounded-lg p-6 shadow-md hover:shadow-lg transition-all border border-white/10"
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl font-bold text-green-500">
                    {benefit.icon}
                  </span>
                  {/* Updated text color */}
                  <p className="text-gray-200 font-medium">{benefit.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Tips Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      >
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          // Updated text color
          className="text-4xl font-bold text-center text-white mb-16"
        >
          Pro Tips for Resume Success
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {[
            {
              title: "Use Keywords from Job Descriptions",
              desc: "Mirror language from the job posting to improve ATS scoring and relevance",
            },
            {
              title: "Quantify Your Achievements",
              desc: "Use numbers and metrics to showcase the impact of your work",
            },
            {
              title: "Keep It Concise",
              desc: "Stick to 1-2 pages maximum to maintain recruiter attention",
            },
            {
              title: "Tailor for Each Position",
              desc: "Customize your resume for each job application to increase success rates",
            },
            {
              title: "Use Action Verbs",
              desc: "Start bullet points with strong action words like 'led', 'managed', 'developed'",
            },
            {
              title: "Proofread Carefully",
              desc: "Typos and errors can hurt your chances - our checker helps prevent this",
            },
          ].map((tip, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              // Updated tip card background
              className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10"
            >
              {/* Updated text colors */}
              <h4 className="text-lg font-bold text-white mb-2">
                {tip.title}
              </h4>
              <p className="text-gray-300">{tip.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        // Updated CTA background
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-500 to-blue-600"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Build Your Resume?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Start creating a professional resume in minutes with HIREWISE
          </p>
          <Link to="/auth">
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            // Inverted button colors
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 mx-auto shadow-lg transition-all"
          >
            Build Your Resume
            <ArrowRight className="h-5 w-5" />
          </motion.button>
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
}