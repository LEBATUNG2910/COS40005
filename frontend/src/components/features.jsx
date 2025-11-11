"use client"

import { motion } from "framer-motion"

export default function Features() {
  const features = [
    {
      icon: "⚡",
      title: "AI-friendly professionally designed resumes",
      description: "All templates are ATS-optimized to ensure your resume passes through applicant tracking systems.",
    },
    {
      icon: "🎨",
      title: "Customizable sections, fonts, colors, and backgrounds",
      description: "Personalize your resume with flexible design options that match your style.",
    },
    {
      icon: "📄",
      title: "Single-column, double-column, and multiple-page layouts",
      description: "Choose the perfect layout that showcases your experience and skills.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
