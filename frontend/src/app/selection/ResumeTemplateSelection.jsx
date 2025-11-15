"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Check } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import pic9 from '../../assets/pic9.jpg'
import pic10 from '../../assets/pic10.jpg'
import pic11 from '../../assets/pic11.jpg'
import pic12 from '../../assets/pic12.jpg'
import pic13 from '../../assets/pic13.jpg'
import pic14 from '../../assets/pic14.jpg'
import pic15 from '../../assets/pic15.jpg'
import pic16 from '../../assets/pic16.jpg'
import pic17 from '../../assets/pic17.jpg'
import pic18 from '../../assets/pic18.jpg'
import pic19 from '../../assets/pic19.jpg'
import pic20 from '../../assets/pic20.jpg'

export default function ResumeTemplateSelection() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const [hideHeader, setHideHeader] = useState(false)

  /** 🔥 Detect scroll direction */
  useEffect(() => {
    let lastScroll = 0

    const handleScroll = () => {
      const currentScroll = window.scrollY

      if (currentScroll > lastScroll && currentScroll > 80) {
        // scroll down → hide
        setHideHeader(true)
      } else {
        // scroll up → show
        setHideHeader(false)
      }

      lastScroll = currentScroll
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const templates = [
    { id: 1, name: "Double Column", image: pic9 },
    { id: 2, name: "Ivy League", image: pic10 },
    { id: 3, name: "Elegant", image: pic11 },
    { id: 4, name: "Contemporary", image: pic12 },
    { id: 5, name: "Polished", image: pic13 },
    { id: 6, name: "Modern", image: pic14 },
    { id: 7, name: "Creative", image: pic15 },
    { id: 8, name: "Timeline", image: pic16 },
    { id: 9, name: "Stylish", image: pic17 },
    { id: 10, name: "Single Column", image: pic18 },
    { id: 11, name: "Elegant with Logos", image: pic19 },
    { id: 12, name: "Double Column with Logos", image: pic20 },
  ]

  // Fake loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

      {/* 🔥 Header hides on scroll */}
      <motion.div
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: hideHeader ? -80 : 0,
          opacity: hideHeader ? 0 : 1,
        }}
        transition={{ duration: 0.35 }}
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

            {/* Progress Steps */}
            <nav className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center gap-2">
                  <motion.div
                    animate={{
                      scale: step === 3 ? 1.1 : 1,
                      backgroundColor: step === 3 ? "#10B981" : "#D1D5DB",
                      borderColor: step === 3 ? "#10B981" : "#D1D5DB",
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                  >
                    {step}
                  </motion.div>
                  {step < 3 && <div className="w-16 h-0.5 bg-gray-300" />}
                </div>
              ))}
            </nav>

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

        {/* Avatar Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-200 via-cyan-100 to-teal-100 flex items-center justify-center">
              <div className="text-6xl">👤</div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Please select a template for your resume.
          </h1>
          <p className="text-lg text-gray-600">
            You can always change it later.
          </p>
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template, idx) => (
            <motion.div
              key={template.id}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedTemplate(template.id)}
              className={`group cursor-pointer relative overflow-hidden rounded-xl shadow-md transition-all ${
                selectedTemplate === template.id
                  ? "ring-2 ring-cyan-500 shadow-xl"
                  : "hover:shadow-lg"
              }`}
            >
              <div className="aspect-[3/4] bg-gray-100 overflow-hidden relative">
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                  <div className="bg-white text-gray-900 px-4 py-2 rounded-full font-semibold">
                    Choose
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white text-center font-semibold">
                {template.name}
              </div>

              {selectedTemplate === template.id && (
                <div className="absolute top-3 right-3 bg-gradient-to-br from-cyan-500 to-teal-500 text-white p-1 rounded-full shadow-lg">
                  <Check className="h-5 w-5" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-12"
          >
            <button className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl">
              Continue with Selected Template
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
