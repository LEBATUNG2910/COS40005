"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Check } from 'lucide-react'
import { useNavigate } from "react-router-dom"
// 🔥 IMPORT CONTEXT
import { useFileStore } from '../../context/FileContext'

// (Assuming images are correct)
import pic9 from '../../assets/pic9.jpg'; import pic10 from '../../assets/pic10.jpg'; import pic11 from '../../assets/pic11.jpg';
import pic12 from '../../assets/pic12.jpg'; import pic13 from '../../assets/pic13.jpg'; import pic14 from '../../assets/pic14.jpg';
import pic15 from '../../assets/pic15.jpg'; import pic16 from '../../assets/pic16.jpg'; import pic17 from '../../assets/pic17.jpg';
import pic18 from '../../assets/pic18.jpg'; import pic19 from '../../assets/pic19.jpg'; import pic20 from '../../assets/pic20.jpg';

export default function ResumeTemplateSelection() {
  const navigate = useNavigate()
  // 🔥 GET CONTEXT SETTER
  const { setSelectedTemplateId } = useFileStore();

  const [isLoading, setIsLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [hideHeader, setHideHeader] = useState(false)

  useEffect(() => {
    let lastScroll = 0
    const handleScroll = () => {
      const currentScroll = window.scrollY
      if (currentScroll > lastScroll && currentScroll > 80) setHideHeader(true)
      else setHideHeader(false)
      lastScroll = currentScroll
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const templates = [
    { id: 1, name: "Double Column", image: pic9 }, { id: 2, name: "Ivy League", image: pic10 },
    { id: 3, name: "Elegant", image: pic11 }, { id: 4, name: "Contemporary", image: pic12 },
    { id: 5, name: "Polished", image: pic13 }, { id: 6, name: "Modern", image: pic14 },
    { id: 7, name: "Creative", image: pic15 }, { id: 8, name: "Timeline", image: pic16 },
    { id: 9, name: "Stylish", image: pic17 }, { id: 10, name: "Single Column", image: pic18 },
    { id: 11, name: "Elegant with Logos", image: pic19 }, { id: 12, name: "Double Column with Logos", image: pic20 },
  ]

  useEffect(() => { const timer = setTimeout(() => setIsLoading(false), 2000); return () => clearTimeout(timer) }, [])

  // 🔥 HANDLER FOR CONTINUE BUTTON
  const handleContinue = () => {
    if (selectedTemplate) {
      setSelectedTemplateId(selectedTemplate); // Save ID to Context
      navigate('/analyst'); // Navigate
    }
  }

  const steps = [
    { id: 1, name: 'Upload' },
    { id: 2, name: 'Template' },
    { id: 3, name: 'Analyze' },
  ]
  const currentStep = 2


  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-500 rounded-full mx-auto mb-6" />
          <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-gray-600 text-lg font-medium">Loading templates...</motion.p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <motion.div initial={{ y: 0, opacity: 1 }} animate={{ y: hideHeader ? -80 : 0, opacity: hideHeader ? 0 : 1 }} className="sticky top-0 z-50 bg-white/80 backdrop-blur-md ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.button whileHover={{ x: -4 }} onClick={() => navigate('/upload')} className="flex items-center gap-2 text-gray-600 hover:text-cyan-600 transition-colors font-medium">
              <ArrowLeft className="h-5 w-5" /> <span>Back</span>
            </motion.button>
            
            {/* 🔥 UPDATED NAV SECTION */}
            <nav className="flex items-center justify-center space-x-4">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <motion.div
                      animate={{
                        scale: step.id === currentStep ? 1.1 : 1,
                        backgroundColor: step.id <= currentStep ? '#10B981' : '#D1D5DB'
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    >
                      {step.id < currentStep ? <Check className="w-4 h-4" /> : step.id}
                    </motion.div>
                    <span className={`text-xs font-medium ${step.id === currentStep ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {step.name}
                    </span>
                  </div>
                  {step.id < steps.length && <div className="w-16 h-0.5 bg-gray-200 mb-4" />}
                </div>
              ))}
            </nav>
            {/* END UPDATED NAV SECTION */}

            <div className="w-16"></div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Choose your resume template</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">Our templates are professionally designed to pass Applicant Tracking Systems (ATS).</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {templates.map((template) => (
            <motion.div
              key={template.id} whileHover={{ y: -10 }} onClick={() => setSelectedTemplate(template.id)}
              className={`group cursor-pointer relative flex flex-col rounded-2xl transition-all duration-300 ${selectedTemplate === template.id ? "ring-4 ring-cyan-500/20" : ""}`}
            >
              <div className={`relative aspect-[1/1.4] rounded-xl overflow-hidden bg-white border-2 transition-all duration-300 shadow-sm ${selectedTemplate === template.id ? "border-cyan-500 shadow-xl" : "border-gray-100 hover:border-cyan-200"}`}>
                <img src={template.image} alt={template.name} className="w-full h-full object-contain p-1 transition-transform duration-500 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur shadow-xl text-gray-900 px-6 py-2 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform">Use Template</div>
                </div>
                <AnimatePresence>
                  {selectedTemplate === template.id && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute top-4 right-4 bg-cyan-500 text-white p-2 rounded-full shadow-lg z-10"><Check className="h-5 w-5 stroke-[3px]" /></motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="mt-4 text-center"><span className={`text-lg font-bold transition-colors ${selectedTemplate === template.id ? "text-cyan-600" : "text-gray-700"}`}>{template.name}</span></div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedTemplate && (
            <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="fixed bottom-10 left-0 right-0 flex justify-center z-50">
              {/* 🔥 UPDATE: Use button with handler instead of Link */}
              <button 
                onClick={handleContinue}
                className="bg-gray-900 hover:bg-black text-white px-10 py-4 rounded-full font-bold shadow-2xl flex items-center gap-3 transition-all active:scale-95"
              >
                <span>Continue with this design</span>
                <div className="h-6 w-px bg-white/20" />
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}