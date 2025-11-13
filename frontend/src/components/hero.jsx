"use client"

import { motion } from "framer-motion"
import pic1 from '../assets/pic1.png'

function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 gradient-bg opacity-20" />
      <div className="absolute inset-0 bg-white" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Save hours by using{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">AI</span> for
              your job hunt
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg text-gray-600 mb-8 leading-relaxed">
              This online resume builder gets people more interviews. The best way to make an impression.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Build Your Resume
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 transition"
              >
                Get Your Resume Score
              </motion.button>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-2xl text-yellow-400">
                    ★
                  </span>
                ))}
              </div>
              <span>4,988 Reviews on Trustpilot</span>
              <span>•</span>
              <span>28,482 users achieved their dream jobs</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="relative h-96 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src={pic1} alt="Resume Preview" className="object-cover w-full h-full" />
                </div>
              </div>
            </div>
            <motion.div
              animate={{ float: 6 }}
              className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full opacity-20 blur-3xl"
            />
            <motion.div
              animate={{ float: 3 }}
              className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full opacity-20 blur-3xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
export default Hero
