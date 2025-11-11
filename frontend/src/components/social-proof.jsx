"use client"

import { motion } from "framer-motion"

export default function SocialProof() {
  const stats = [
    { number: "15M+", label: "resumes created" },
    { number: "10M+", label: "resume examples" },
    { number: "11 years", label: "of helping job seekers" },
    { number: "1M+", label: "monthly blog readers" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants} className="text-center">
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{stat.number}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
