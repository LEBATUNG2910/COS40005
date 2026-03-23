"use client"
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Briefcase, Brain, BookOpen, CheckCircle,
  AlertTriangle, TrendingUp, ExternalLink, ChevronDown,
  Loader2, FileText, Target, Eye, Sparkles,
  PenLine, X, Plus, RefreshCw, TrendingDown, RotateCcw, Check, Quote
} from 'lucide-react'
import { authService } from '../../services/authService'

function StepNav({ currentStep }) {
  const steps = [
    { id: 1, name: 'Upload' },
    { id: 2, name: 'Template' },
    { id: 3, name: 'Analyze' },
  ]
  return (
    <nav className="flex items-center justify-center gap-1 sm:gap-2">
      {steps.map((step) => (
        <div key={step.id} className="flex items-center gap-1 sm:gap-2">
          <div className="flex flex-col items-center gap-1">
            <motion.div
              animate={{
                scale: step.id === currentStep ? 1.1 : 1,
                backgroundColor: step.id <= currentStep ? '#10B981' : '#D1D5DB'
              }}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm"
            >
              {step.id < currentStep ? <Check className="w-3.5 h-3.5" /> : step.id}
            </motion.div>
            <span className={`text-xs font-medium hidden sm:block ${step.id === currentStep ? 'text-emerald-600' : 'text-gray-400'}`}>
              {step.name}
            </span>
          </div>
          {step.id < steps.length && <div className="w-8 sm:w-16 h-0.5 bg-gray-200" />}
        </div>
      ))}
    </nav>
  )
}

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


/* ─── Score Breakdown Bars ───────────────────────────────────── */
function ScoreBreakdown({ breakdown }) {
  const bars = [
    {
      label: 'Text Match',
      hint: 'How much CV text overlaps with the JD (BM25)',
      value: breakdown.bm25,
      color: '#0891b2',       // cyan-600
      bg: '#ecfeff',
      border: '#a5f3fc',
    },
    {
      label: 'Skill Match',
      hint: 'Percentage of JD skills found in your CV',
      value: breakdown.skillMatch,
      color: '#10b981',       // emerald-500
      bg: '#f0fdf4',
      border: '#a7f3d0',
    },
    {
      label: 'Depth Score',
      hint: 'How frequently each skill is mentioned (shows experience)',
      value: breakdown.depth,
      color: '#8b5cf6',       // violet-500
      bg: '#f5f3ff',
      border: '#ddd6fe',
    },
  ]

  return (
    <div className="space-y-3">
      {bars.map((bar, i) => (
        <motion.div
          key={bar.label}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 + i * 0.12 }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-700">{bar.label}</span>
              <div className="group relative">
                <span className="text-gray-300 cursor-default text-xs">ⓘ</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-44 bg-gray-900 text-white text-xs rounded-lg px-2.5 py-1.5 leading-snug opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                  {bar.hint}
                </div>
              </div>
            </div>
            <span className="text-xs font-bold tabular-nums" style={{ color: bar.color }}>{bar.value}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: bar.border }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: bar.color }}
              initial={{ width: 0 }}
              animate={{ width: `${bar.value}%` }}
              transition={{ duration: 1.2, delay: 0.9 + i * 0.12, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      ))}
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


/* ─── Score Delta Badge (before/after) ──────────────────────── */
function ScoreDelta({ before, after }) {
  const delta = after - before
  if (delta === 0) return null
  const positive = delta > 0
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
        positive
          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
          : 'bg-red-50 text-red-500 border-red-200'
      }`}
    >
      {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {positive ? '+' : ''}{delta} from last analysis
    </motion.div>
  )
}

/* ─── CV Editor Drawer ───────────────────────────────────────── */
const SECTION_LABELS = {
  summary: 'Summary', experience: 'Experience', skills: 'Skills',
  education: 'Education', projects: 'Projects', certifications: 'Certifications',
}
const PLACEHOLDERS = {
  summary:        'Experienced software engineer with 5+ years building scalable web applications...',
  experience:     'Senior Developer | Company | 2021 – Present\n• Key achievement 1\n• Key achievement 2\n\nJunior Developer | Startup | 2019 – 2021\n• ...',
  skills:         'JavaScript, TypeScript, React, Node.js, PostgreSQL, Docker, AWS...',
  education:      'B.Sc Computer Science | University of Tech | 2016 – 2020 | GPA 3.8',
  projects:       'Project Name — React, NestJS\nDescription of what you built and the impact',
  certifications: 'AWS Solutions Architect | Amazon | 2023',
}

function CVEditorDrawer({ onClose, onSaveAndReanalyze, missingSkills = [] }) {
  const token = authService.getToken()
  const sectionKeys = ['summary', 'experience', 'skills', 'education', 'projects', 'certifications']
  const [values, setValues] = useState({
    summary: '', experience: '', skills: '', education: '', projects: '', certifications: ''
  })
  const [activeTab, setActiveTab] = useState('summary')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const buildText = () =>
    sectionKeys.filter(k => values[k].trim())
      .map(k => `${SECTION_LABELS[k].toUpperCase()}\n${values[k]}`).join('\n\n')

  const addMissingSkill = (skill) => {
    setValues(v => ({ ...v, skills: v.skills ? `${v.skills}, ${skill}` : skill }))
    setActiveTab('skills')
  }

  const handleSave = async () => {
    const text = buildText()
    if (text.trim().length < 20) { alert('Please fill in at least one section'); return }
    setSaving(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'}/cv/update-text`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ extractedText: text }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setSaved(true)
      setTimeout(() => { setSaved(false); onClose(); onSaveAndReanalyze() }, 600)
    } catch (err) { alert(err.message) }
    finally { setSaving(false) }
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="fixed right-0 top-0 h-screen w-full max-w-lg bg-white border-l border-gray-200 z-50 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center">
              <PenLine className="w-3.5 h-3.5 text-cyan-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Edit CV Content</h2>
              <p className="text-xs text-gray-400">Save to update & re-analyze automatically</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Missing skills quick-add */}
        {missingSkills.length > 0 && (
          <div className="px-5 py-3 border-b border-gray-100 bg-orange-50 flex-shrink-0">
            <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3" /> Missing Skills — click to add
            </p>
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.map(skill => (
                <button key={skill} onClick={() => addMissingSkill(skill)}
                  className="text-xs bg-white border border-orange-200 text-orange-600 hover:bg-orange-100 px-2.5 py-1 rounded-full capitalize transition flex items-center gap-1">
                  <Plus className="w-2.5 h-2.5" /> {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section tabs */}
        <div className="flex flex-wrap gap-1 px-4 py-2.5 border-b border-gray-100 flex-shrink-0">
          {sectionKeys.map(key => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === key ? 'bg-cyan-500 text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              }`}>
              {SECTION_LABELS[key]}
              {values[key].trim() && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{SECTION_LABELS[activeTab]}</label>
          <textarea key={activeTab} value={values[activeTab]}
            onChange={e => setValues(v => ({ ...v, [activeTab]: e.target.value }))}
            placeholder={PLACEHOLDERS[activeTab]}
            className="w-full h-72 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none resize-none text-sm text-gray-800 placeholder-gray-400 transition-colors leading-relaxed"
          />
          <p className="text-xs text-gray-400 font-mono mt-1.5">{values[activeTab].length} chars</p>
          <div className="mt-4 bg-cyan-50 border border-cyan-100 rounded-xl p-3.5">
            <p className="text-xs text-cyan-700 leading-relaxed">
              <span className="font-bold">Tip:</span> Use exact keywords from the job description in Experience and Skills to improve your score.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-200 bg-white flex items-center justify-between flex-shrink-0">
          <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600 transition font-medium">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all text-sm">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
              : saved ? <><CheckCircle className="w-4 h-4" /> Saved!</>
              : <><RefreshCw className="w-4 h-4" /> Save & Re-analyze</>}
          </button>
        </div>
      </motion.div>
    </>
  )
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function CvAnalyst() {
  const navigate = useNavigate()
  const [jobDescription, setJobDescription] = useState(() => localStorage.getItem('analyst_last_jd') || '')
  const [cvInfo, setCvInfo] = useState(null)
  const [result, setResult] = useState(() => {
    try {
      const saved = localStorage.getItem('analyst_last_result')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState(null)
  const [loadingCV, setLoadingCV] = useState(true)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [showPdf, setShowPdf] = useState(false)
  const token = authService.getToken()
  const [showEditor, setShowEditor] = useState(false)
  const [prevScore, setPrevScore] = useState(null)   // lưu score trước khi re-analyze
  const [hideHeader, setHideHeader] = useState(false)

  useEffect(() => {
    let lastScroll = 0
    const handleScroll = () => {
      const currentScroll = window.scrollY
      setHideHeader(currentScroll > lastScroll && currentScroll > 80)
      lastScroll = currentScroll
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
        const res = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'}/cv/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (res.ok && data.hasCV !== false) {
          // Nếu CV mới hơn result đang lưu → xóa result cũ
          const savedResult = localStorage.getItem('analyst_last_result')
          if (savedResult) {
            try {
              const parsed = JSON.parse(savedResult)
              const savedAt = new Date(parsed.uploadedAt).getTime()
              const cvUploadedAt = new Date(data.uploadedAt).getTime()
              if (cvUploadedAt > savedAt) {
                localStorage.removeItem('analyst_last_result')
                setResult(null)
              }
            } catch {}
          }
          setCvInfo(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingCV(false)
      }
    }
    fetchCVInfo()
  }, [])

  /* fetch PDF blob — re-fetch khi CV thay đổi (dựa vào uploadedAt) */
  useEffect(() => {
    if (!cvInfo?.uploadedAt) return
    // Revoke blob URL cũ trước khi fetch mới
    setPdfUrl(prev => { if (prev) URL.revokeObjectURL(prev); return null })
    const loadPdf = async () => {
      try {
        // Thêm timestamp để bypass browser cache
        const ts = new Date(cvInfo.uploadedAt).getTime()
        const res = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'}/cv/preview?t=${ts}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) setPdfUrl(URL.createObjectURL(await res.blob()))
      } catch (err) {
        console.error(err)
      }
    }
    loadPdf()
    return () => { setPdfUrl(prev => { if (prev) URL.revokeObjectURL(prev); return null }) }
  }, [cvInfo?.uploadedAt])

  /* analyze */
  const handleAnalyze = useCallback(async () => {
    if (!jobDescription.trim()) { setError('Please paste a job description first'); return }
    setAnalyzing(true); setError(null)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'}/cv/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ jobDescription }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Analysis failed')
      localStorage.setItem('analyst_last_jd', jobDescription)
      // Lưu result vào localStorage — nhưng bỏ qua nếu là điểm thử nghiệm
      if (!data.isTemporary) {
        try { localStorage.setItem('analyst_last_result', JSON.stringify(data)) } catch {}
      }
      // lưu score cũ trước khi overwrite result
      setResult(prev => { if (prev) setPrevScore(prev.matchScore); return prev })
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setAnalyzing(false)
    }
  }, [jobDescription, token])

  /* sau khi editor save → đóng drawer → re-analyze */
  const handleSaveAndReanalyze = useCallback(() => {
    setTimeout(() => handleAnalyze(), 350)
  }, [handleAnalyze])

  return (
    <div className="min-h-screen bg-white pb-20" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>

      {/* ── Header / Step Indicator (Updated to match ResumeTemplateSelection structure) ── */}
      <motion.div
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: hideHeader ? -80 : 0, opacity: hideHeader ? 0 : 1 }}
        className="sticky top-0 z-100 bg-white/80 backdrop-blur-md border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <motion.button 
              whileHover={{ x: -4 }} 
              onClick={() => navigate('/selection')}
              className="flex items-center gap-1.5 text-gray-600 hover:text-cyan-600 transition-colors font-medium text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" /> Back
            </motion.button>
            <StepNav currentStep={3} />
            <div className="w-14 sm:w-16" /> {/* Spacer for balance */}
          </div>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-5 pt-8">

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
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => setShowEditor(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 hover:border-cyan-400 text-gray-500 hover:text-cyan-500 rounded-lg text-xs font-semibold transition">
                <PenLine className="w-3 h-3" /> Edit
              </button>
              <span className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                <CheckCircle className="w-3 h-3" /> Ready
              </span>
            </div>
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
                {/* Score ring + breakdown + delta */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-center relative">
                    <ScoreRing score={result.matchScore} />
                    <button onClick={handleAnalyze} disabled={analyzing}
                      title="Re-analyze with same JD"
                      className="absolute top-0 right-0 p-1.5 text-gray-300 hover:text-cyan-500 hover:bg-cyan-50 rounded-lg transition">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {prevScore !== null && prevScore !== result.matchScore && (
                    <div className="flex justify-center">
                      <ScoreDelta before={prevScore} after={result.matchScore} />
                    </div>
                  )}
                  {result.scoreBreakdown && (
                    <ScoreBreakdown breakdown={result.scoreBreakdown} />
                  )}
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

              {/* Skills Evidence — tìm thấy ở đâu trong CV */}
              {result.aiAnalysis?.skillsEvidence?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Quote className="w-4 h-4 text-cyan-500" />
                    <h3 className="font-bold text-gray-900 text-sm">Skill Evidence</h3>
                    <span className="text-xs text-gray-400 ml-1">— where AI found each skill in your CV</span>
                  </div>
                  <div className="space-y-2">
                    {result.aiAnalysis.skillsEvidence.map((ev, i) => (
                      <div key={i} className={`flex items-start gap-3 p-2.5 rounded-xl ${ev.found ? 'bg-emerald-50' : 'bg-gray-50'}`}>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${ev.found ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                          {ev.found ? `✓ ×${ev.frequency ?? 1}` : '✗'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-gray-700 capitalize">{ev.skill}</span>
                          {ev.found && ev.quote && (
                            <p className="text-xs text-gray-500 italic mt-0.5 truncate">"{ev.quote}"</p>
                          )}
                          {!ev.found && (
                            <p className="text-xs text-gray-400 mt-0.5">Not found in CV</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Low score warning — chỉ hiện khi score < 60 */}
              {result.matchScore < 60 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-orange-50 border border-orange-200 rounded-2xl p-5 flex items-start gap-4"
                >
                  <div className="w-9 h-9 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle className="w-4.5 h-4.5 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-orange-800 text-sm mb-1">
                      Low match score — your CV needs improvement for this role
                    </p>
                    <p className="text-xs text-orange-600 leading-relaxed mb-3">
                      {result.missingSkills.length > 0
                        ? `You're missing ${result.missingSkills.length} key skill${result.missingSkills.length > 1 ? 's' : ''} from this JD. Edit your CV to add them, then re-analyze to see your score improve.`
                        : 'Your CV text doesn\'t overlap enough with the job description. Try rewriting your experience using keywords from the JD, then re-analyze.'}
                    </p>
                    <button onClick={() => setShowEditor(true)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition">
                      <PenLine className="w-3.5 h-3.5" /> Edit CV to improve score
                    </button>
                  </div>
                </motion.div>
              )}

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
                    <ul className="space-y-3">
                      {result.aiAnalysis.strengths?.map((s, i) => {
                        const point = typeof s === 'string' ? s : s.point
                        const evidence = typeof s === 'object' ? s.evidence : null
                        return (
                          <li key={i} className="space-y-1">
                            <div className="flex items-start gap-2.5 text-sm text-gray-700">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                              {point}
                            </div>
                            {evidence?.quote && (
                              <div className="ml-6 flex items-start gap-1.5 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1.5">
                                <Quote className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-emerald-700 italic leading-relaxed">
                                  "{evidence.quote}"
                                  {evidence.location && <span className="text-emerald-400 not-italic"> — {evidence.location}</span>}
                                </p>
                              </div>
                            )}
                          </li>
                        )
                      })}
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
                    <ul className="space-y-3">
                      {result.aiAnalysis.weaknesses?.map((w, i) => {
                        const point = typeof w === 'string' ? w : w.point
                        const evidence = typeof w === 'object' ? w.evidence : null
                        return (
                          <li key={i} className="space-y-1">
                            <div className="flex items-start gap-2.5 text-sm text-gray-700">
                              <div className="w-3.5 h-3.5 rounded-full border border-orange-400 flex items-center justify-center mt-0.5 flex-shrink-0">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                              </div>
                              {point}
                            </div>
                            {evidence?.quote && (
                              <div className="ml-6 flex items-start gap-1.5 bg-orange-50 border border-orange-100 rounded-lg px-2.5 py-1.5">
                                <Quote className="w-3 h-3 text-orange-400 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-orange-700 italic leading-relaxed">
                                  "{evidence.quote}"
                                  {evidence.location && <span className="text-orange-400 not-italic"> — {evidence.location}</span>}
                                </p>
                              </div>
                            )}
                          </li>
                        )
                      })}
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

              {/* CTA Banner — dynamic theo score */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center"
              >
                {result.matchScore >= 70 ? (
                  <>
                    <p className="text-xs text-emerald-500 font-semibold tracking-widest uppercase mb-2">🎯 Great Match</p>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Ready to apply!</h3>
                    <p className="text-sm text-gray-400 mb-5">Your CV matches this role well. You can still refine it further.</p>
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => setShowEditor(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-cyan-400 text-gray-700 hover:text-cyan-500 font-semibold rounded-xl transition-all text-sm">
                        <PenLine className="w-4 h-4" /> Fine-tune CV
                      </button>
                      <button onClick={() => navigate('/resume')}  className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition-all active:scale-95 text-sm">
                        Build Resume →
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-orange-500 font-semibold tracking-widest uppercase mb-2">⚡ Needs Improvement</p>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Improve your score first</h3>
                    <p className="text-sm text-gray-400 mb-5">
                      {result.missingSkills.length > 0
                        ? `Add ${result.missingSkills.slice(0, 3).join(', ')}${result.missingSkills.length > 3 ? ' and more' : ''} to your CV to boost your match.`
                        : 'Rewrite your experience using more keywords from the job description.'}
                    </p>
                    <button onClick={() => setShowEditor(true)}
                      className="flex items-center gap-2 mx-auto px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all active:scale-95 text-sm">
                      <PenLine className="w-4 h-4" /> Edit CV & Re-analyze
                    </button>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CV Editor Drawer */}
      <AnimatePresence>
        {showEditor && (
          <CVEditorDrawer
            onClose={() => setShowEditor(false)}
            onSaveAndReanalyze={handleSaveAndReanalyze}
            missingSkills={result?.missingSkills || []}
          />
        )}
      </AnimatePresence>
    </div>
  )
}