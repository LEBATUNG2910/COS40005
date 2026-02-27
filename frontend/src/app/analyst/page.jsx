"use client"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Briefcase, Brain, BookOpen, CheckCircle,
  AlertTriangle, TrendingUp, ExternalLink, ChevronDown,
  ChevronUp, Loader2, FileText, Zap, Target, Eye, Sparkles
} from 'lucide-react'
import { authService } from '../../services/authService'

/* ─── Score Ring ─────────────────────────────────────────────── */
function ScoreRing({ score }) {
  const radius = 56
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 70 ? '#34d399' : score >= 40 ? '#fbbf24' : '#f87171'
  const trackColor = score >= 70 ? '#064e3b' : score >= 40 ? '#451a03' : '#450a0a'
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
          <p className="text-xs text-slate-400 font-semibold tracking-widest uppercase mt-0.5">score</p>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-white">{emoji} {label}</p>
        <p className="text-xs text-slate-500 mt-0.5 font-mono">BM25 Algorithm</p>
      </div>
    </div>
  )
}

/* ─── Resource Card ──────────────────────────────────────────── */
function ResourceCard({ resource }) {
  const styles = {
    'Roadmap.sh': 'bg-pink-500/15 text-pink-400 border-pink-500/20',
    'FreeCodeCamp': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    'Udemy': 'bg-violet-500/15 text-violet-400 border-violet-500/20',
    'YouTube': 'bg-red-500/15 text-red-400 border-red-500/20'
  }
  const style = styles[resource.platform] || 'bg-slate-700 text-slate-300 border-slate-600'

  return (
    <a
      href={resource.url} target="_blank" rel="noreferrer"
      className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-cyan-500/40 hover:bg-slate-800 transition-all group"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-md border flex-shrink-0 ${style}`}>
          {resource.platform}
        </span>
        <span className="text-sm text-slate-300 group-hover:text-white truncate transition-colors">
          {resource.name}
        </span>
        {resource.type === 'free' && (
          <span className="text-xs text-emerald-400 font-bold flex-shrink-0 bg-emerald-500/10 px-1.5 py-0.5 rounded">FREE</span>
        )}
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 flex-shrink-0 ml-2 transition-colors" />
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
      className="bg-slate-800/60 rounded-2xl border border-slate-700/50 overflow-hidden hover:border-orange-500/30 transition-colors"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div>
            <p className="font-semibold text-white capitalize text-sm">{suggestion.skill}</p>
            <p className="text-xs text-slate-500 mt-0.5">{suggestion.resources?.length || 0} resources available</p>
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-slate-400" />
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
            <div className="px-4 pb-4 space-y-3 border-t border-slate-700/50 pt-3">
              <p className="text-sm text-slate-400 leading-relaxed">{suggestion.reason}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Resources</p>
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

/* ─── Step Indicator ─────────────────────────────────────────── */
function StepIndicator() {
  return (
    <div className="hidden sm:flex items-center gap-1">
      {['Upload', 'Template', 'Analyze'].map((label, i) => (
        <div key={label} className="flex items-center gap-1">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            i === 2
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-500'
          }`}>
            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${
              i < 2 ? 'bg-slate-600 text-slate-300' : 'bg-cyan-500 text-white'
            }`}>{i + 1}</div>
            {label}
          </div>
          {i < 2 && <div className="w-4 h-px bg-slate-700" />}
        </div>
      ))}
    </div>
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

  /* fetch CV metadata */
  useEffect(() => {
    const fetchCVInfo = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/cv/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        // handle both {hasCV: false} and 400 gracefully
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
    <div className="min-h-screen bg-slate-950 pb-20" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>

      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      {/* ── Navbar ── */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={() => navigate('/selection')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>

         

          <StepIndicator />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-5 relative">

        {/* ── CV Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border p-5 flex items-center gap-4 ${
            cvInfo
              ? 'bg-slate-900/60 border-slate-700/60 backdrop-blur-sm'
              : 'bg-red-950/30 border-red-800/30'
          }`}
        >
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
            cvInfo ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-red-500/10 border border-red-500/20'
          }`}>
            <FileText className={`w-5 h-5 ${cvInfo ? 'text-cyan-400' : 'text-red-400'}`} />
          </div>

          {loadingCV ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading CV info...
            </div>
          ) : cvInfo ? (
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate text-sm">{cvInfo.fileName}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Template #{cvInfo.templateId} · {new Date(cvInfo.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              {cvInfo.preview && (
                <p className="text-xs text-slate-600 mt-1.5 line-clamp-1 font-mono">{cvInfo.preview}…</p>
              )}
            </div>
          ) : (
            <div className="flex-1">
              <p className="font-semibold text-red-400 text-sm">No CV uploaded</p>
              <button onClick={() => navigate('/upload')} className="text-xs text-cyan-400 hover:text-cyan-300 mt-1 underline underline-offset-2">
                ← Upload your CV first
              </button>
            </div>
          )}

          {cvInfo && (
            <span className="flex-shrink-0 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full">
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
            className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/60 overflow-hidden"
          >
            <button
              onClick={() => setShowPdf(!showPdf)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-white text-sm">Preview Uploaded CV</span>
                {!showPdf && <span className="text-xs text-slate-500">click to expand</span>}
              </div>
              <motion.div animate={{ rotate: showPdf ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </motion.div>
            </button>
            <AnimatePresence>
              {showPdf && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 640 }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden border-t border-slate-700/50"
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
          className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/60 p-6"
        >
          <div className="flex items-center gap-2.5 mb-1">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Job Description</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4 ml-6.5">Paste the full JD — we'll match it against your CV using BM25 + Gemini AI</p>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here...&#10;&#10;e.g. We are looking for a Senior React Developer with 3+ years experience in TypeScript, Node.js, PostgreSQL..."
            className="w-full h-44 px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none resize-none text-sm text-slate-200 placeholder-slate-600 transition-colors"
          />

          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-slate-600 font-mono">{jobDescription.length} chars</p>
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !jobDescription.trim() || !cvInfo}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all active:scale-95 text-sm shadow-lg shadow-cyan-500/20"
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
              className="text-red-400 text-sm mt-3 bg-red-500/10 border border-red-500/20 p-3 rounded-xl"
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
              className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/60 p-12 text-center"
            >
              <div className="relative w-14 h-14 mx-auto mb-5">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
                <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <Brain className="w-7 h-7 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <p className="text-lg font-bold text-white">Analyzing your CV…</p>
              <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                Extracting skills, calculating BM25 match score, and generating personalized recommendations.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {['Parsing PDF', 'BM25 matching', 'Calling Gemini', 'Finding courses'].map((step, i) => (
                  <motion.span
                    key={step}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.6 }}
                    className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1.5 rounded-full font-medium"
                  >
                    {step}
                  </motion.span>
                ))}
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
                <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/60 p-8 flex items-center justify-center">
                  <ScoreRing score={result.matchScore} />
                </div>

                {/* CV Skills */}
                <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/60 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-white text-sm">Skills in Your CV</h3>
                    <span className="ml-auto text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {result.cvSkills.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.cvSkills.length > 0
                      ? result.cvSkills.map(s => (
                          <span key={s} className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium capitalize">
                            {s}
                          </span>
                        ))
                      : <p className="text-xs text-slate-500">No matching skills detected</p>
                    }
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/60 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    <h3 className="font-bold text-white text-sm">Missing Skills</h3>
                    <span className="ml-auto text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">
                      {result.missingSkills.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingSkills.length > 0
                      ? result.missingSkills.map(s => (
                          <span key={s} className="text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-1 rounded-full font-medium capitalize">
                            {s}
                          </span>
                        ))
                      : <p className="text-xs text-emerald-400 font-semibold">✅ No missing skills!</p>
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
                  className="relative bg-gradient-to-r from-cyan-950/60 to-blue-950/60 backdrop-blur-sm rounded-2xl border border-cyan-800/30 p-6 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl" />
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <Brain className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <h3 className="font-bold text-white text-sm">AI Assessment</h3>
                    <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full">Gemini</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-sm">{result.aiAnalysis.overallFeedback}</p>
                </motion.div>
              )}

              {/* Strengths & Weaknesses */}
              {result.aiAnalysis && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/60 p-5"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <h3 className="font-bold text-white text-sm">Strengths</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {result.aiAnalysis.strengths?.map((s, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/60 p-5"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="w-4 h-4 text-orange-400" />
                      <h3 className="font-bold text-white text-sm">Areas to Improve</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {result.aiAnalysis.weaknesses?.map((w, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                          <div className="w-3.5 h-3.5 rounded-full border border-orange-400/50 flex items-center justify-center mt-0.5 flex-shrink-0">
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
                  className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/60 p-6"
                >
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                      <BookOpen className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                    <h3 className="font-bold text-white text-sm">Learning Roadmap</h3>
                    <span className="text-xs bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-full">
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
                className="relative bg-gradient-to-r from-slate-900 to-slate-900 rounded-2xl border border-slate-700/60 p-8 text-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-cyan-500/50 to-transparent" />
                <div className="relative">
                  <p className="text-xs text-cyan-400 font-semibold tracking-widest uppercase mb-2">Next Step</p>
                  <h3 className="text-xl font-bold text-white mb-1">Build your optimised resume</h3>
                  <p className="text-sm text-slate-500 mb-5">Using Template #{result.templateId} tailored to this role.</p>
                  <button className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all active:scale-95 text-sm shadow-lg shadow-cyan-500/20">
                    Build Resume →
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}