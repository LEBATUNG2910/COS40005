"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, FileText, BarChart3, PenSquare, TrendingUp,
  Calendar, ChevronRight, Award, AlertCircle, Lightbulb,
  Upload, Clock, Target, Zap, BookOpen, ExternalLink,
  ChevronDown, ChevronUp, RefreshCw, Loader2
} from 'lucide-react'
import { authService } from '../../services/authService'

const API = 'http://localhost:3001/api'

/* ─── Helpers ──────────────────────────────────────────────────── */
const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'
const scoreColor = (s) => s >= 70 ? 'text-emerald-600' : s >= 45 ? 'text-amber-500' : 'text-rose-500'
const scoreBg    = (s) => s >= 70 ? 'bg-emerald-50/50 border-emerald-100 hover:bg-emerald-50 transition-colors' : s >= 45 ? 'bg-amber-50/50 border-amber-100 hover:bg-amber-50 transition-colors' : 'bg-rose-50/50 border-rose-100 hover:bg-rose-50 transition-colors'
const badgeBg    = (s) => s >= 70 ? 'bg-emerald-100 text-emerald-700' : s >= 45 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'

/* ─── Score Ring ────────────────────────────────────────────────── */
function ScoreRing({ score, size = 80 }) {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <svg width={size} height={size} className="-rotate-90 filter drop-shadow-sm">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" className="text-slate-200/60" strokeWidth="6" />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={score >= 70 ? '#10b981' : score >= 45 ? '#f59e0b' : '#f43f5e'}
        strokeWidth="6" strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
    </svg>
  )
}

/* ─── Stat Card ─────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[1.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:shadow-cyan-500/10 hover:border-cyan-100 transition-all duration-300"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner flex-shrink-0 ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-800 leading-none mb-1.5">{value}</p>
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        {sub && <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">{sub}</p>}
      </div>
    </motion.div>
  )
}

/* ─── Analysis Card ─────────────────────────────────────────────── */
function AnalysisCard({ item, index }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-2xl border shadow-sm ${scoreBg(item.matchScore)} overflow-hidden`}
    >
      {/* Header */}
      <div className="p-5 flex items-center gap-5 cursor-pointer" onClick={() => setOpen(v => !v)}>
        {/* Score ring */}
        <div className="relative flex-shrink-0 bg-white rounded-full p-1 shadow-sm">
          <ScoreRing score={item.matchScore} size={56} />
          <span className={`absolute inset-0 flex items-center justify-center text-sm font-extrabold tracking-tight ${scoreColor(item.matchScore)}`}>
            {item.matchScore}
          </span>
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[15px] text-slate-800 font-bold line-clamp-2 leading-snug mb-1">
            {item.jobDescriptionPreview || "Job Analysis"}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Calendar size={13} className="text-slate-400" /> {fmt(item.analyzedAt)}
            </span>
            {item.scoreBreakdown && (
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeBg(item.scoreBreakdown.skillMatch)}`}>
                Skill match: {item.scoreBreakdown.skillMatch}%
              </span>
            )}
          </div>
        </div>
        {/* Toggle */}
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-slate-400 group-hover:text-cyan-600 transition-colors">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden bg-white/60 border-t border-slate-100"
          >
            <div className="p-5 space-y-5">
              {/* Overall feedback */}
              {item.overallFeedback && (
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400"></div>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    "{item.overallFeedback}"
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Strengths */}
                {item.strengths?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Award size={14} /> Strengths
                    </p>
                    <ul className="space-y-2">
                      {item.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-slate-700 flex gap-2.5 items-start bg-white p-2.5 rounded-lg border border-slate-50 shadow-sm">
                          <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">✓</span> 
                          <span className="leading-snug">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Weaknesses */}
                {item.weaknesses?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <AlertCircle size={14} /> Areas to Improve
                    </p>
                    <ul className="space-y-2">
                      {item.weaknesses.map((w, i) => (
                        <li key={i} className="text-sm text-slate-700 flex gap-2.5 items-start bg-white p-2.5 rounded-lg border border-slate-50 shadow-sm">
                          <span className="w-5 h-5 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">→</span> 
                          <span className="leading-snug">{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Suggestions */}
              {item.suggestions?.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-bold text-cyan-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Lightbulb size={14} /> Recommended Learning Paths
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {item.suggestions.map((s, i) => (
                      <div key={i} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-sm font-bold text-slate-800 mb-1">{s.skill}</p>
                        <p className="text-xs text-slate-500 mb-3 leading-relaxed">{s.reason}</p>
                        <div className="flex flex-wrap gap-2">
                          {s.resources?.map((r, j) => (
                            <a key={j} href={r.url} target="_blank" rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600 hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
                            >
                              <BookOpen size={12} /> {r.platform}
                              <ExternalLink size={10} className="opacity-50" />
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── Main Dashboard ────────────────────────────────────────────── */
export default function Dashboard() {
  const [user, setUser]           = useState(null)
  const [cv, setCv]               = useState(null)
  const [history, setHistory]     = useState([])
  const [resumeStatus, setResumeStatus] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    const token = authService.getToken()
    if (!token) { window.location.href = '/auth'; return }
    fetchAll(token)
  }, [])

  const fetchAll = async (token) => {
    setLoading(true)
    setError(null)
    const headers = { Authorization: `Bearer ${token}` }
    try {
      const [userRes, cvRes, historyRes, resumeRes] = await Promise.all([
        fetch(`${API}/auth/me`,       { headers }),
        fetch(`${API}/cv/me`,         { headers }),
        fetch(`${API}/cv/history`,    { headers }),
        fetch(`${API}/resume/data`,   { headers }),
      ])

      if (userRes.status === 401) { authService.logout(); window.location.href = '/auth'; return }

      const [userData, cvData, historyData, resumeData] = await Promise.all([
        userRes.json(), cvRes.json(), historyRes.json(), resumeRes.json(),
      ])

      setUser(userData)
      setCv(cvData?.hasCV ? cvData : null)
      setHistory(Array.isArray(historyData) ? historyData : [])
      setResumeStatus(resumeData?.hasData ? resumeData : null)
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  /* ── Stats ── */
  const totalAnalyses = history.length
  const bestScore = history.length > 0 ? Math.max(...history.map(h => h.matchScore)) : 0
  const avgScore  = history.length > 0 ? Math.round(history.reduce((a, h) => a + h.matchScore, 0) / history.length) : 0

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-5 text-slate-500">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin absolute"></div>
        </div>
        <p className="text-sm font-semibold tracking-wide uppercase text-cyan-600">Loading Dashboard</p>
      </motion.div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-sm w-full border border-slate-100">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Sync Error</h3>
        <p className="text-slate-500 mb-8">{error}</p>
        <button onClick={() => fetchAll(authService.getToken())} className="w-full flex items-center justify-center gap-2 py-3.5 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/30">
          <RefreshCw size={18} /> Try Again
        </button>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative pb-20">
      
      {/* ── Background Header ── */}
      <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-br from-cyan-400 to-cyan-600 overflow-hidden z-0">
        <div className="absolute inset-0 bg-white/5"></div>
        <div className="absolute top-[-20%] right-[-5%] w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-cyan-800/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10">
        
        {/* ── Top Navigation & Welcome ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 text-white">
          <div className="flex items-center gap-4">
            <a href="/account" className="p-2.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </a>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">Workspace Dashboard</h1>
              <p className="text-cyan-50 font-medium opacity-90">Welcome back, {user?.fullName?.split(' ')[0] ?? 'there'}</p>
            </div>
          </div>
          <button onClick={() => fetchAll(authService.getToken())}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm text-sm font-semibold border border-white/10">
            <RefreshCw size={16} /> Sync Data
          </button>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard icon={BarChart3}  label="Total Analyses"  value={totalAnalyses}         color="bg-cyan-500"    />
          <StatCard icon={Target}     label="Best Fit Score"  value={bestScore ? `${bestScore}` : '—'} sub={bestScore ? 'Out of 99' : 'No analyses'} color="bg-emerald-500" />
          <StatCard icon={TrendingUp} label="Average Score"   value={avgScore   ? `${avgScore}` : '—'} sub={avgScore ? 'Across all jobs' : 'Needs data'}  color="bg-violet-500"  />
          <StatCard icon={FileText}   label="CV Status"       value={cv ? 'Active' : 'None'}  sub={cv ? cv.fileName?.substring(0, 16) : 'Upload required'} color="bg-amber-500" />
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Action Hub (CV & Resume) ── */}
          <div className="lg:col-span-1 space-y-6">

            {/* Resume Builder Status */}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-[1.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <PenSquare size={20} className="text-violet-500" /> Resume Builder
                </h2>
                {resumeStatus && (
                  <button onClick={() => window.location.href = '/builder'}
                    className="text-xs text-violet-600 hover:text-violet-700 font-bold uppercase tracking-wider bg-violet-50 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                    Open <ChevronRight size={14} />
                  </button>
                )}
              </div>

              {resumeStatus ? (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Zap size={14} className="text-violet-400" /> Active Profile
                    </p>
                    {resumeStatus.personalInfo?.name && (
                      <p className="text-base text-slate-800 font-bold mb-3">{resumeStatus.personalInfo.name}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {[
                        resumeStatus.experience?.length > 0 && { label: `${resumeStatus.experience.length} roles`, color: 'bg-blue-50 text-blue-700 border-blue-100' },
                        resumeStatus.education?.length > 0 && { label: `${resumeStatus.education.length} degrees`, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                        resumeStatus.skills?.length > 0 && { label: `${resumeStatus.skills.length} skills`, color: 'bg-amber-50 text-amber-700 border-amber-100' },
                        resumeStatus.projects?.length > 0 && { label: `${resumeStatus.projects.length} projects`, color: 'bg-rose-50 text-rose-700 border-rose-100' },
                      ].filter(Boolean).map((tag, i) => (
                        <span key={i} className={`text-[11px] font-bold border rounded-md px-2 py-1 ${tag.color}`}>
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => window.location.href = '/resume'}
                    className="w-full bg-violet-500 hover:bg-violet-600 text-white text-sm font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2">
                    <PenSquare size={16} /> Continue Editing
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 bg-slate-50 border border-slate-100 border-dashed rounded-xl">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
                    <PenSquare size={20} className="text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600 mb-1">No resume started</p>
                  <p className="text-xs text-slate-400 mb-4 px-4">Create a targeted resume from scratch or use your CV.</p>
                  <button onClick={() => window.location.href = '/builder'}
                    className="bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-violet-500/20">
                    Start Building
                  </button>
                </div>
              )}
            </motion.div>

            {/* CV Card */}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[1.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Upload size={20} className="text-cyan-500" /> Master CV
                </h2>
                {cv && (
                  <button onClick={() => window.location.href = '/upload'}
                    className="text-xs text-cyan-600 hover:text-cyan-700 font-bold uppercase tracking-wider bg-cyan-50 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                    Replace <ChevronRight size={14} />
                  </button>
                )}
              </div>

              {cv ? (
                <div className="space-y-4">
                  <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4 flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <FileText size={20} className="text-cyan-600 flex-shrink-0" />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-sm font-bold text-slate-800 truncate">{cv.fileName}</p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                        <Clock size={12} /> {fmt(cv.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-4 space-y-2.5 border border-slate-100">
                    {cv.extractionMethod && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Extraction</span>
                        <span className="bg-white border border-slate-200 shadow-sm rounded-md px-2 py-1 text-[10px] font-bold uppercase text-slate-700">
                          {cv.extractionMethod}
                        </span>
                      </div>
                    )}
                    {cv.templateId && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Template ID</span>
                        <span className="bg-white border border-slate-200 shadow-sm rounded-md px-2 py-1 text-[10px] font-bold uppercase text-slate-700">
                          #{cv.templateId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-slate-50 border border-slate-100 border-dashed rounded-xl">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
                    <Upload size={20} className="text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600 mb-1">No CV uploaded</p>
                  <p className="text-xs text-slate-400 mb-4 px-4">Upload your master CV to start analyzing jobs.</p>
                  <button onClick={() => window.location.href = '/upload'}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-cyan-500/20">
                    Upload CV
                  </button>
                </div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              className="bg-white rounded-[1.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-6">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Zap size={14} className="text-amber-500" /> Quick Links
              </h2>
              <div className="space-y-2">
                {[
                  { label: 'Analyze CV vs Job',  icon: BarChart3,  href: '/analyst',   color: 'text-cyan-700 bg-cyan-50 hover:bg-cyan-100' },
                  { label: 'Upload Master CV',    icon: Upload,     href: '/upload',    color: 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100' },
                  { label: 'Account Settings',    icon: Target,     href: '/account',   color: 'text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-100' },
                ].map(({ label, icon: Icon, href, color }) => (
                  <button key={label} onClick={() => window.location.href = href}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-bold ${color}`}>
                    <Icon size={18} />
                    {label}
                    <ChevronRight size={16} className="ml-auto opacity-50" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right: Analysis History ── */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[1.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-6 sm:p-8 h-full flex flex-col">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2.5">
                    <BarChart3 size={24} className="text-cyan-500" /> 
                    Analysis History
                    {history.length > 0 && (
                      <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                        {history.length}
                      </span>
                    )}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Review your recent CV vs Job Description matches.</p>
                </div>

                <button onClick={() => window.location.href = '/analyst'}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md">
                  New Analysis <ChevronRight size={16} />
                </button>
              </div>

              {history.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-16 px-4 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50 mt-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                    <BarChart3 size={32} className="text-cyan-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">No analyses yet</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                    See how well your CV matches specific job requirements. Upload a CV and paste a job description to get started.
                  </p>
                  <button onClick={() => window.location.href = '/analyst'}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20">
                    Start Analyzing
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar flex-1">
                  {history.map((item, i) => (
                    <AnalysisCard key={item.id} item={item} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Optional: custom scrollbar style embedded */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 20px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #cbd5e1; }
      `}} />
    </div>
  )
}