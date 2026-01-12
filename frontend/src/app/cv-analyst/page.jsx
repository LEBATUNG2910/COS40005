"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, BrainCircuit, ExternalLink, BookOpen, Youtube, Code2 } from 'lucide-react'
// 🔥 IMPORT CONTEXT
import { useFileStore } from '../../context/FileContext'

const PLATFORM_ICONS = {
  udemy: { color: "text-purple-600", bg: "bg-purple-50", icon: BookOpen },
  youtube: { color: "text-red-600", bg: "bg-red-50", icon: Youtube },
  roadmap: { color: "text-blue-600", bg: "bg-blue-50", icon: ExternalLink },
  default: { color: "text-gray-600", bg: "bg-gray-50", icon: Code2 }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, when: "beforeChildren" } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function CvAnalyst() {
  const navigate = useNavigate()
  
  // 🔥 GET DATA FROM CONTEXT
  const { uploadedFile, selectedTemplateId } = useFileStore();
  
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [pdfUrl, setPdfUrl] = useState(null) // <--- NEW STATE FOR PDF URL

  // 🔥 EFFECT: CREATE PREVIEW URL FOR PDF
  useEffect(() => {
    if (uploadedFile) {
      // Create a fake URL for the file in memory
      const objectUrl = URL.createObjectURL(uploadedFile);
      setPdfUrl(objectUrl);

      // Clean up memory when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [uploadedFile]);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return alert("Please paste a job description first.")
    if (!uploadedFile) return alert("No CV file found. Please upload one first.")
    
    setIsAnalyzing(true)

    const formData = new FormData()
    formData.append('resume', uploadedFile)
    formData.append('job_description', jobDescription)

    try {
      const response = await fetch('http://localhost:3001/analyze', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error("Analysis failed. Is the backend running on port 3001?");
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error(err)
      alert("Error analyzing CV: " + err.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <motion.div className="min-h-screen bg-gray-50 flex flex-col" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
      {/* Header */}
      <motion.header variants={itemVariants} className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <div className="font-bold text-xl text-cyan-600 flex items-center gap-2">
            <BrainCircuit className="text-cyan-600" /> <span>AI CV Analyst</span>
          </div>
          <div className="w-20"></div>
        </div>
      </motion.header>

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 grid lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: Resume PREVIEW (Updated) */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col h-[calc(100vh-8rem)] sticky top-24">
          <h3 className="font-semibold text-gray-700 mb-4">Selected Resume</h3>
          <div className="flex-1 bg-gray-100 rounded-xl border border-gray-300 overflow-hidden relative">
            
            {/* 🔥 SHOW ACTUAL PDF IF EXISTS */}
            {pdfUrl ? (
              <iframe 
                src={pdfUrl} 
                className="w-full h-full" 
                title="Resume Preview"
                style={{ border: 'none' }}
              />
            ) : (
              // Fallback if no file found
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-16 h-16 bg-white rounded-full shadow-sm mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">📄</span>
                </div>
                <p className="text-gray-900 font-bold text-lg">No File Uploaded</p>
                <button onClick={() => navigate('/upload')} className="mt-4 text-cyan-600 underline">Go Upload CV</button>
              </div>
            )}

          </div>
          {uploadedFile && (
             <p className="text-xs text-gray-400 mt-2 text-center">Viewing: {uploadedFile.name}</p>
          )}
        </motion.div>

        {/* RIGHT COLUMN: AI Tools (Same as before) */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-bold text-gray-900 mb-2">Paste Job Description</label>
            <textarea 
              value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the full job description here..."
              className="w-full text-black h-48 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 resize-none transition-all"
            />
            <button onClick={handleAnalyze} disabled={isAnalyzing || !uploadedFile} className="mt-4 w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {isAnalyzing ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><BrainCircuit className="w-5 h-5" /></motion.div> Analyzing Match...</> : "Analyze Match"}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
                  <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${result.match_score > 70 ? "from-green-400 to-green-600" : "from-red-400 to-yellow-500"} origin-left`} />
                  <div className="flex items-center justify-between mb-6">
                    <div><h3 className="text-lg font-bold text-gray-900">Match Score</h3><p className="text-sm text-gray-500">Based on keyword analysis</p></div>
                    <div className={`text-4xl font-black ${result.match_score > 70 ? "text-green-600" : result.match_score > 40 ? "text-yellow-600" : "text-red-600"}`}>{result.match_score}%</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl text-blue-800 text-sm leading-relaxed"><strong>AI Feedback:</strong> {result.feedback}</div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Missing Skills</h3>
                  <div className="flex flex-wrap gap-2">{result.missing_skills.map((skill, idx) => (<span key={idx} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm font-semibold border border-red-100">{skill}</span>))}</div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended Learning Path</h3>
                  <div className="grid gap-3">
                    {result.learning_links.map((item, idx) => {
                      const platform = PLATFORM_ICONS[item.type] || PLATFORM_ICONS.default;
                      const Icon = platform.icon;
                      return (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-cyan-200 hover:shadow-md transition-all group">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg ${platform.bg} ${platform.color} flex items-center justify-center`}><Icon className="w-5 h-5" /></div>
                            <div><p className="font-semibold text-gray-900">{item.topic}</p><p className="text-xs text-gray-500 capitalize">{item.type}</p></div>
                          </div>
                          <div className="flex gap-3">
                             {item.youtube && <a href={item.youtube} target="_blank" className="text-xs font-bold text-red-600 hover:underline">YouTube</a>}
                             {item.udemy && <a href={item.udemy} target="_blank" className="text-xs font-bold text-purple-600 hover:underline">Udemy</a>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}