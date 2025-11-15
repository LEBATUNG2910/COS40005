"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Check } from 'lucide-react'
import { useNavigate } from "react-router-dom"

export default function ResumeTemplateSelection() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const templates = [
    {
      id: 1,
      name: "Double Column",
      image: "/resume-template-double-column-professional.jpg",
    },
    {
      id: 2,
      name: "Ivy League",
      image: "/resume-template-ivy-league-clean.jpg",
    },
    {
      id: 3,
      name: "Elegant",
      image: "/resume-template-elegant-teal-sidebar.jpg",
    },
    {
      id: 4,
      name: "Contemporary",
      image: "/resume-template-contemporary-modern.jpg",
    },
    {
      id: 5,
      name: "Polished",
      image: "/resume-template-polished-navy-blue.jpg",
    },
    {
      id: 6,
      name: "Modern",
      image: "/resume-template-modern-orange-accent.jpg",
    },
    {
      id: 7,
      name: "Creative",
      image: "/resume-template-creative-navy-sidebar.jpg",
    },
    {
      id: 8,
      name: "Timeline",
      image: "/resume-template-timeline-modern.jpg",
    },
    {
      id: 9,
      name: "Stylish",
      image: "/resume-template-stylish-light-blue.jpg",
    },
    {
      id: 10,
      name: "Single Column",
      image: "/resume-template-single-column-clean.jpg",
    },
    {
      id: 11,
      name: "Elegant with Logos",
      image: "/resume-template-elegant-teal-logos.jpg",
    },
    {
      id: 12,
      name: "Double Column with Logos",
      image: "/resume-template-double-column-logos-blue.jpg",
    },
  ]

  // Simulate loading on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Loading skeleton animation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-500 rounded-full mx-auto mb-6"
          />
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-gray-600 text-lg font-medium"
          >
            Loading templates...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  const steps = [
    { id: 1, name: "Start" },
    { id: 2, name: "Customize" },
    { id: 3, name: "Finish" },
  ];
  const currentStep = 3;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header with Progress */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 backdrop-blur-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 items-center">
            {/* Back Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors w-fit"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back</span>
            </motion.button>

            {/* Progress Bar - Centered */}
            <nav className="flex items-center justify-center space-x-4">
              {[
                { id: 1, name: "Start" },
                { id: 2, name: "Customize" },
                { id: 3, name: "Finish" },
              ].map((step) => (
                <div key={step.id} className="flex items-center gap-2">
                  <motion.div
                    animate={{
                      scale: step.id === 3 ? 1.1 : 1,
                      backgroundColor:
                        step.id === 3
                          ? "#10B981" // Green-500
                          : "#D1D5DB", // Gray-300
                      borderColor:
                        step.id === 3
                          ? "#10B981" // Green-500
                          : "#D1D5DB", // Gray-300
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                  >
                    {step.id}
                  </motion.div>
                  {step.id < 3 && (
                    <div className="w-16 h-0.5 bg-gray-300" />
                  )}
                </div>
              ))}
            </nav>

            {/* Empty div for grid balance */}
            <div></div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        {/* User Avatar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block mb-8">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative"
            >
              {/* Decorative shapes */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-12 opacity-10"
              >
                <svg viewBox="0 0 200 200" className="w-32 h-32">
                  <circle cx="100" cy="50" r="40" fill="#06B6D4" />
                  <circle cx="150" cy="120" r="30" fill="#EC4899" />
                  <circle cx="50" cy="130" r="35" fill="#10B981" />
                </svg>
              </motion.div>

              {/* Avatar */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-200 via-cyan-100 to-teal-100 flex items-center justify-center overflow-hidden shadow-xl">
                <div className="text-6xl">👤</div>
              </div>
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            Please select a template for your resume.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-gray-600"
          >
            You can always change it later.
          </motion.p>
        </motion.div>

        {/* Templates Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {templates.map((template, idx) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.05 }}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedTemplate(template.id)}
              className={`group cursor-pointer relative overflow-hidden rounded-xl shadow-md transition-all ${
                selectedTemplate === template.id
                  ? "ring-2 ring-cyan-500 shadow-xl"
                  : "hover:shadow-lg"
              }`}
            >
              {/* Template Image */}
              <div className="aspect-[3/4] bg-gray-100 overflow-hidden relative">
                <motion.img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Overlay on hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/20 flex items-center justify-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="bg-white text-gray-900 px-4 py-2 rounded-full font-semibold"
                  >
                    Choose
                  </motion.div>
                </motion.div>
              </div>

              {/* Template Name */}
              <div className="p-4 bg-white">
                <p className="text-center font-semibold text-gray-900">{template.name}</p>
              </div>

              {/* Selected Indicator */}
              {selectedTemplate === template.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 bg-gradient-to-br from-cyan-500 to-teal-500 text-white p-1 rounded-full shadow-lg"
                >
                  <Check className="h-5 w-5" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(6,182,212,0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Continue with Selected Template
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}