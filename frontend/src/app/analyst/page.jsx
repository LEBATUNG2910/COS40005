"use client"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Briefcase, Brain, BookOpen, CheckCircle,
  AlertTriangle, TrendingUp, ExternalLink, ChevronDown,
  Loader2, FileText, Target, Eye, Sparkles
} from 'lucide-react'
import { authService } from '../../services/authService'

/* ─── Score Ring ─────────────────────────────────────────────── */
function ScoreRing({ score }) {
  const radius = 56
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'
  const trackColor = score >= 70 ? '#d1fae5' : score >= 40 ? '#fef3c7' : '#fee2e2'
  const label = score >= 70 ? 'Strong Match' : score >= 40 ? 'Good Potential' : 'Needs Work'
  const emoji = score >= 70 ? '🎯' : score >= 40 ? '⚡' : '⚠️'

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke={trackColor} strokeWidth="10" />
          <motion.circle
            cx="64" cy="64" r={radius} fill="none" stroke={color}
            strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
          />
        </svg>
        <div className="text-center z-10">
          <motion.p
            className="text-4xl font-black leading-none"
            style={{ color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
          >
            {score}
          </motion.p>
          <p className="text-xs text-gray-400 font-semibold tracking-widest uppercase mt-0.5">score</p>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-gray-800">{emoji} {label}</p>
        <p className="text-xs text-gray-400 mt-0.5 font-mono">BM25 Algorithm</p>
      </div>
    </div>
  )
}

/* ─── Resource Card ──────────────────────────────────────────── */
function ResourceCard({ resource }) {
  const styles = {
    'Roadmap.sh': 'bg-pink-50 text-pink-600 border-pink-200',
    'FreeCodeCamp': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'Udemy': 'bg-violet-50 text-violet-600 border-violet-200',
    'YouTube': 'bg-red-50 text-red-600 border-red-200'
  }
  const style = styles[resource.platform] || 'bg-gray-100 text-gray-600 border-gray-200'

  return (
    <a
      href={resource.url} target="_blank" rel="noreferrer"
      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl hover:border-cyan-400 hover:bg-cyan-50 transition-all group"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-md border flex-shrink-0 ${style}`}>
          {resource.platform}
        </span>
        <span className="text-sm text-gray-700 group-hover:text-gray-900 truncate transition-colors">
          {resource.name}
        </span>
        {resource.type === 'free' && (
          <span className="text-xs text-emerald-600 font-bold flex-shrink-0 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">FREE</span>
        )}
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-cyan-500 flex-shrink-0 ml-2 transition-colors" />
    </a>
  )
}

/* ─── Skill Card ──────────────────────────────────────────────── */
function SkillCard({ suggestion, index }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-orange-300 transition-colors shadow-sm"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-800 capitalize text-sm">{suggestion.skill}</p>
            <p className="text-xs text-gray-400 mt-0.5">{suggestion.resources?.length || 0} resources available</p>
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
              <p className="text-sm text-gray-600 leading-relaxed">{suggestion.reason}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Resources</p>
              <div className="space-y-2">
                {suggestion.resources?.map((r, i) => <ResourceCard key={i} resource={r} />)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function CvAnalyst() {
  const navigate = useNavigate()
  const [jobDescription, setJobDescription] = useState('')
  const [cvInfo, setCvInfo] = useState(null)
  const [result, setResult] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState(null)
  const [loadingCV, setLoadingCV] = useState(true)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [showPdf, setShowPdf] = useState(false)
  const token = authService.getToken()

  const steps = [
    { id: 1, name: 'Upload' },
    { id: 2, name: 'Template' },
    { id: 3, name: 'Analyze' },
  ]
  const currentStep = 3

  /* fetch CV metadata */
  useEffect(() => {
    const fetchCVInfo = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/cv/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (res.ok && data.hasCV !== false) setCvInfo(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingCV(false)
      }
    }
    fetchCVInfo()
  }, [])

  /* fetch PDF blob for preview */
  useEffect(() => {
    if (!cvInfo) return
    const loadPdf = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/cv/preview', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) setPdfUrl(URL.createObjectURL(await res.blob()))
      } catch (err) {
        console.error(err)
      }
    }
    loadPdf()
    return () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl) }
  }, [cvInfo])

  /* analyze */
  const handleAnalyze = async () => {
    if (!jobDescription.trim()) { setError('Please paste a job description first'); return }
    setAnalyzing(true); setError(null); setResult(null)
    try {
      const res = await fetch('http://localhost:3001/api/cv/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ jobDescription }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Analysis failed')
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-20" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>

      {/* ── Header / Step Indicator ── */}
      <div className="max-w-5xl mx-auto px-6 pt-8 mb-8">
        <div className="grid grid-cols-3 items-center">
          <button
            onClick={() => navigate('/selection')}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors w-fit font-semibold"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>

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
                    {step.id < currentStep ? <CheckCircle className="w-4 h-4" /> : step.id}
                  </motion.div>
                  <span className={`text-xs font-medium ${step.id === currentStep ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {step.name}
                  </span>
                </div>
                {step.id < steps.length && <div className="w-16 h-0.5 bg-gray-200 mb-4" />}
              </div>
            ))}
          </nav>

          <div />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-5">

        {/* ── CV Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border p-5 flex items-center gap-4 ${
            cvInfo ? 'bg-white border-gray-200 shadow-sm' : 'bg-red-50 border-red-200'
          }`}
        >
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
            cvInfo ? 'bg-cyan-50 border border-cyan-200' : 'bg-red-100 border border-red-200'
          }`}>
            <FileText className={`w-5 h-5 ${cvInfo ? 'text-cyan-500' : 'text-red-500'}`} />
          </div>

          {loadingCV ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading CV info...
            </div>
          ) : cvInfo ? (
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate text-sm">{cvInfo.fileName}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Template #{cvInfo.templateId} · {new Date(cvInfo.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              {cvInfo.preview && (
                <p className="text-xs text-gray-400 mt-1.5 line-clamp-1 font-mono">{cvInfo.preview}…</p>
              )}
            </div>
          ) : (
            <div className="flex-1">
              <p className="font-semibold text-red-500 text-sm">No CV uploaded</p>
              <button onClick={() => navigate('/upload')} className="text-xs text-cyan-500 hover:text-cyan-600 mt-1 underline underline-offset-2">
                ← Upload your CV first
              </button>
            </div>
          )}

          {cvInfo && (
            <span className="flex-shrink-0 flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold px-3 py-1.5 rounded-full">
              <CheckCircle className="w-3 h-3" /> Ready
            </span>
          )}
        </motion.div>

        {/* ── PDF Preview ── */}
        {pdfUrl && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <button
              onClick={() => setShowPdf(!showPdf)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-cyan-500" />
                <span className="font-semibold text-gray-800 text-sm">Preview Uploaded CV</span>
                {!showPdf && <span className="text-xs text-gray-400">click to expand</span>}
              </div>
              <motion.div animate={{ rotate: showPdf ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </motion.div>
            </button>
            <AnimatePresence>
              {showPdf && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 640 }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden border-t border-gray-100"
                >
                  <iframe src={pdfUrl} title="CV Preview" className="w-full h-[640px] border-0" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── JD Input ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
        >
          <div className="flex items-center gap-2.5 mb-1">
            <Briefcase className="w-4 h-4 text-cyan-500" />
            <h2 className="text-base font-bold text-gray-900">Job Description</h2>
          </div>
          <p className="text-xs text-gray-400 mb-4 ml-6">Paste the full JD — we'll match it against your CV using BM25 + Gemini AI</p>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here...&#10;&#10;e.g. We are looking for a Senior React Developer with 3+ years experience in TypeScript, Node.js, PostgreSQL..."
            className="w-full h-44 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none resize-none text-sm text-gray-800 placeholder-gray-400 transition-colors"
          />

          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-400 font-mono">{jobDescription.length} chars</p>
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !jobDescription.trim() || !cvInfo}
              className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all active:scale-95 text-sm"
            >
              {analyzing
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</>
                : <><Sparkles className="w-4 h-4" /> Analyze with AI</>
              }
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm mt-3 bg-red-50 border border-red-200 p-3 rounded-xl"
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        {/* ── Analyzing Loader ── */}
        <AnimatePresence>
          {analyzing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center"
            >
              <div className="relative w-14 h-14 mx-auto mb-5">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-300 animate-ping" />
                <div className="w-14 h-14 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center">
                  <Brain className="w-7 h-7 text-cyan-500 animate-pulse" />
                </div>
              </div>
              <p className="text-lg font-bold text-gray-900">Analyzing your CV…</p>
              <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                Extracting skills, calculating BM25 match score, and generating personalized recommendations.
              </p>

              {/* Progress bar */}
              <div className="max-w-sm mx-auto mt-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-cyan-500 h-2 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '90%' }}
                    transition={{ duration: 4, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {['Parsing PDF', 'BM25 matching', 'Calling Gemini'].map((step, i) => (
                    <motion.span
                      key={step}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.6 }}
                      className="text-xs bg-cyan-50 text-cyan-600 border border-cyan-200 px-3 py-1.5 rounded-full font-medium"
                    >
                      {step}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results ── */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              {/* Score + Skills grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Score ring */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex items-center justify-center">
                  <ScoreRing score={result.matchScore} />
                </div>

                {/* CV Skills */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-4 h-4 text-emerald-500" />
                    <h3 className="font-bold text-gray-900 text-sm">Skills in Your CV</h3>
                    <span className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {result.cvSkills.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.cvSkills.length > 0
                      ? result.cvSkills.map(s => (
                          <span key={s} className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-full font-medium capitalize">
                            {s}
                          </span>
                        ))
                      : <p className="text-xs text-gray-400">No matching skills detected</p>
                    }
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <h3 className="font-bold text-gray-900 text-sm">Missing Skills</h3>
                    <span className="ml-auto text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                      {result.missingSkills.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingSkills.length > 0
                      ? result.missingSkills.map(s => (
                          <span key={s} className="text-xs bg-orange-50 text-orange-600 border border-orange-200 px-2.5 py-1 rounded-full font-medium capitalize">
                            {s}
                          </span>
                        ))
                      : <p className="text-xs text-emerald-600 font-semibold">✅ No missing skills!</p>
                    }
                  </div>
                </div>
              </div>

              {/* AI Overall Feedback */}
              {result.aiAnalysis?.overallFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-cyan-50 border border-cyan-200 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-white border border-cyan-200 flex items-center justify-center">
                      <Brain className="w-3.5 h-3.5 text-cyan-500" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">AI Assessment</h3>
                    <span className="text-xs bg-white text-cyan-600 border border-cyan-200 px-2 py-0.5 rounded-full font-medium">Gemini</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">{result.aiAnalysis.overallFeedback}</p>
                </motion.div>
              )}

              {/* Strengths & Weaknesses */}
              {result.aiAnalysis && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <h3 className="font-bold text-gray-900 text-sm">Strengths</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {result.aiAnalysis.strengths?.map((s, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <h3 className="font-bold text-gray-900 text-sm">Areas to Improve</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {result.aiAnalysis.weaknesses?.map((w, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <div className="w-3.5 h-3.5 rounded-full border border-orange-400 flex items-center justify-center mt-0.5 flex-shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                          </div>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              )}

              {/* Learning Roadmap */}
              {result.aiAnalysis?.suggestions?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
                >
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-7 h-7 rounded-lg bg-violet-50 border border-violet-200 flex items-center justify-center">
                      <BookOpen className="w-3.5 h-3.5 text-violet-500" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">Learning Roadmap</h3>
                    <span className="text-xs bg-violet-50 text-violet-600 border border-violet-200 px-2 py-0.5 rounded-full font-medium">
                      {result.aiAnalysis.suggestions.length} skills
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {result.aiAnalysis.suggestions.map((s, i) => (
                      <SkillCard key={i} suggestion={s} index={i} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* CTA Banner */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center"
              >
                <p className="text-xs text-cyan-500 font-semibold tracking-widest uppercase mb-2">Next Step</p>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Build your optimised resume</h3>
                <p className="text-sm text-gray-400 mb-5">Using Template #{result.templateId} tailored to this role.</p>
                <button className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition-all active:scale-95 text-sm">
                  Build Resume →
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}