"use client"

import { motion } from "framer-motion"
import pic3 from "../assets/pic3.jpg"

function CareerTools() {
  const tools = [
    { icon: "📄", name: "Resume Builder", color: "from-green-400 to-blue-500" },
    { icon: "✓", name: "Resume Checker", color: "from-blue-400 to-purple-500" },
    { icon: "✉️", name: "Cover Letter Generator", color: "from-purple-400 to-pink-500" },
    { icon: "🎯", name: "Job Tracker", color: "from-pink-400 to-red-500" },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">All the career tools you need</h2>
          <p className="text-xl text-gray-600">Complete suite of tools to help you land your dream job</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
          className="grid md:grid-cols-4 gap-4 mb-12"
        >
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
              className={`bg-gradient-to-br ${tool.color} p-6 rounded-xl text-white text-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}
            >
              <div className="text-4xl mb-3">{tool.icon}</div>
              <h3 className="font-semibold text-lg">{tool.name}</h3>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">For applicants across all career paths</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-cyan-500">●</span> Senior professionals & executives
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-500">●</span> Entry-level & first-time job seekers
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-500">●</span> Career changers
                </li>
              </ul>
            </div>
            <div className="relative h-64">
              <img
                src={pic3}
                alt="Career Paths"
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default  CareerTools
