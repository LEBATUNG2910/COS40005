"use client"
import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Upload, FileText, BarChart3, GitCompare, Briefcase,
  Trophy, AlertTriangle, CheckCircle, X, Loader2,
  ChevronDown, ChevronUp, Sparkles, Target, Trash2,
  Users, TrendingUp, TrendingDown, Minus, RefreshCw,
  AlertCircle, Crown, Medal, Award, Layers, Search
} from 'lucide-react'
import { authService } from '../../services/authService'

const API = 'http://localhost:3001/api'

/* ─── Helpers ──────────────────────────────────────────────────── */
const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'
const scoreColor  = (s) => s >= 70 ? '#10b981' : s >= 45 ? '#f59e0b' : '#ef4444'
const scoreBgCls  = (s) => s >= 70 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : s >= 45 ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'
const rankIcon    = (r) => {
  if (r === 1) return <div className="bg-amber-100 p-1.5 rounded-lg shadow-sm"><Crown size={16} className="text-amber-500" /></div>
  if (r === 2) return <div className="bg-slate-100 p-1.5 rounded-lg shadow-sm"><Medal size={16} className="text-slate-400" /></div>
  if (r === 3) return <div className="bg-orange-100 p-1.5 rounded-lg shadow-sm"><Award size={16} className="text-orange-700" /></div>
  return <span className="text-sm font-black text-gray-300">#{r}</span>
}

/* ─── Modern Score Ring ─────────────────────────────────────────── */
function MiniRing({ score, size = 52 }) {
  const r = (size - 6) / 2
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <svg width={size} height={size} className="-rotate-90 flex-shrink-0 drop-shadow-sm">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f3f4f6" strokeWidth="5" />
      <motion.circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={scoreColor(score)} strokeWidth="5" strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </svg>
  )
}

/* ─── Score Bar ─────────────────────────────────────────────────── */
function ScoreBar({ label, value, color, delay = 0 }) {
  return (
    <div className="group">
      <div className="flex justify-between mb-1.5 items-end">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
        <span className="text-xs font-black tabular-nums" style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <motion.div className="h-full rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}40` }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay, ease: 'backOut' }}
        />
      </div>
    </div>
  )
}

/* ─── Upload Zone ───────────────────────────────────────────────── */
function UploadZone({ onUpload, uploading }) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  const handleFiles = (files) => {
    const pdfs = [...files].filter(f => f.name.match(/\.(pdf|doc|docx)$/i))
    if (pdfs.length > 0) onUpload(pdfs)
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
      onClick={() => inputRef.current?.click()}
      className={`relative group border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 overflow-hidden ${
        dragOver ? 'border-cyan-500 bg-cyan-50/50 scale-[0.99]' : 'border-gray-200 hover:border-cyan-400 hover:bg-white hover:shadow-xl hover:shadow-cyan-500/5'
      }`}
    >
      <input ref={inputRef} type="file" multiple accept=".pdf,.doc,.docx" className="hidden"
        onChange={e => handleFiles(e.target.files)} />
      
      <div className={`flex flex-col items-center gap-3 transition-transform duration-300 ${dragOver ? 'scale-105' : ''}`}>
        {uploading ? (
          <div className="py-2">
            <Loader2 size={32} className="text-cyan-500 animate-spin mb-3 mx-auto" />
            <p className="text-sm font-bold text-gray-600 animate-pulse">Processing CVs...</p>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-50 to-white border border-cyan-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all">
              <Upload size={24} className="text-cyan-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700">Drop CVs here or click to browse</p>
              <p className="text-[11px] text-gray-400 mt-1">PDF, DOC, DOCX up to 20 files</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ─── CV List Item ──────────────────────────────────────────────── */
function CvListItem({ cv, selected, onToggle, onDelete, score }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={`flex items-center gap-4 p-3.5 rounded-2xl border transition-all duration-300 group ${
        selected ? 'border-cyan-500 bg-cyan-50/50 shadow-md shadow-cyan-500/10' : 'border-white bg-white/60 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-200/50'
      }`}
      onClick={onToggle}
    >
      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
        selected ? 'border-cyan-500 bg-cyan-500 scale-110' : 'border-gray-200 group-hover:border-gray-300'
      }`}>
        {selected && <CheckCircle size={12} className="text-white" />}
      </div>

      {score !== undefined ? (
        <div className="relative flex-shrink-0">
          <MiniRing score={score} size={42} />
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black" style={{ color: scoreColor(score) }}>
            {score}
          </span>
        </div>
      ) : (
        <div className="w-10 h-10 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center border border-gray-100">
          <FileText size={16} className="text-gray-300" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-800 truncate leading-tight">{cv.candidateName}</p>
        <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">{cv.fileName}</p>
      </div>

      <button onClick={e => { e.stopPropagation(); onDelete(cv.cvId) }}
        className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
        <Trash2 size={14} />
      </button>
    </motion.div>
  )
}

/* ─── Ranking Row ───────────────────────────────────────────────── */
function RankRow({ item, onSelect, isSelected }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01 }}
      onClick={() => onSelect(item)}
      className={`flex items-center gap-5 p-4 rounded-3xl border cursor-pointer transition-all duration-300 group ${
        isSelected ? 'border-cyan-500 bg-white shadow-xl shadow-cyan-500/10' : 'border-white bg-white/70 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/50'
      }`}
    >
      <div className="w-10 flex items-center justify-center flex-shrink-0">
        {rankIcon(item.rank)}
      </div>

      <div className="relative flex-shrink-0">
        <MiniRing score={item.matchScore} size={54} />
        <span className="absolute inset-0 flex items-center justify-center text-[13px] font-black" style={{ color: scoreColor(item.matchScore) }}>
          {item.matchScore}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-black text-gray-900 truncate tracking-tight">{item.candidateName}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 items-center">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Match {Math.round((item.bm25Score ?? 0) * 100)}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.cvSkills?.length ?? 0} Skills Found</span>
          </div>
        </div>
      </div>

      <div className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] border-2 shadow-sm flex-shrink-0 ${scoreBgCls(item.matchScore)}`}>
        {item.matchScore >= 70 ? 'Top Tier' : item.matchScore >= 45 ? 'Qualified' : 'Poor Fit'}
      </div>
    </motion.div>
  )
}

/* ─── Side-by-Side Compare Panel ───────────────────────────────── */
function ComparePanel({ result, onClose }) {
  const { cvA, cvB, skillsComparison, winner, scoreDiff, cvSimilarity, duplicate } = result

  const CVCard = ({ cv, side }) => {
    const isWinner = winner === side
    return (
      <div className={`flex-1 rounded-[2.5rem] border-2 p-8 transition-all duration-500 relative overflow-hidden ${
        isWinner ? 'border-cyan-500 bg-gradient-to-br from-cyan-50 to-white shadow-2xl shadow-cyan-500/10' : 'border-gray-100 bg-white'
      }`}>
        {isWinner && (
          <div className="absolute top-0 right-0 px-6 py-2 bg-cyan-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-3xl shadow-lg">
            Recommended
          </div>
        )}
        
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xl font-black text-gray-900 tracking-tight">{cv.candidateName}</p>
            <p className="text-[11px] font-bold text-gray-400 mt-1 bg-gray-50 inline-block px-2 py-0.5 rounded-lg border border-gray-100 uppercase tracking-widest">{cv.fileName}</p>
          </div>
          <div className="relative group">
            <div className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-500 ${isWinner ? 'bg-cyan-400/30' : 'bg-gray-200/50'}`}></div>
            <div className="relative">
              <MiniRing score={cv.matchScore} size={64} />
              <span className="absolute inset-0 flex items-center justify-center text-lg font-black" style={{ color: scoreColor(cv.matchScore) }}>
                {cv.matchScore}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <ScoreBar label="Syntactic Match (BM25)" value={Math.round((cv.bm25Score ?? 0) * 100)} color="#0891b2" delay={0.2} />
          <ScoreBar label="Semantic Skill Alignment" value={Math.round((cv.skillMatchRatio ?? 0) * 100)} color="#10b981" delay={0.3} />
        </div>

        <div className="mb-6">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Key Proficiencies</p>
          <div className="flex flex-wrap gap-1.5">
            {cv.cvSkills?.slice(0, 10).map(s => (
              <span key={s} className="text-[10px] font-bold bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-xl shadow-sm hover:border-emerald-300 transition-colors">{s}</span>
            ))}
            {(cv.cvSkills?.length ?? 0) > 10 && <span className="text-[10px] font-bold text-gray-300 ml-1 flex items-center">+{cv.cvSkills.length - 10}</span>}
          </div>
        </div>

        {cv.overallFeedback && (
          <div className="relative">
            <div className="absolute -left-3 top-0 bottom-0 w-1 bg-cyan-200 rounded-full opacity-50"></div>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed pl-3 italic">
              "{cv.overallFeedback}"
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-4">
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/40 p-10">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-500 border border-violet-100">
              <GitCompare size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Side-by-Side Comparison</h3>
              <div className="flex items-center gap-2 mt-1">
                {duplicate && <span className="text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-500 px-3 py-0.5 rounded-full border border-rose-100">Alert: CV Duplicate</span>}
                <span className="text-[10px] font-black uppercase tracking-widest bg-gray-50 text-gray-400 px-3 py-0.5 rounded-full border border-gray-100">AI Driven Analysis</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all text-gray-400">
            <X size={20} />
          </button>
        </div>

        {scoreDiff > 0 && (
          <div className="flex items-center gap-4 mb-8 p-6 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-[2rem] text-white shadow-xl shadow-cyan-500/20">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-[13px] font-medium opacity-80 uppercase tracking-widest">Match Advantage</p>
              <p className="font-bold text-lg">
                {winner === 'A' ? result.cvA.candidateName : result.cvB.candidateName} is {scoreDiff} pts more compatible
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col xl:flex-row gap-6 mb-8">
          <CVCard cv={result.cvA} side="A" />
          <CVCard cv={result.cvB} side="B" />
        </div>

        {skillsComparison && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Shared Mastery", list: skillsComparison.commonSkills, color: "emerald", icon: CheckCircle },
              { title: `Only ${result.cvA.candidateName.split(' ')[0]}`, list: skillsComparison.uniqueToA, color: "cyan", icon: Sparkles },
              { title: `Only ${result.cvB.candidateName.split(' ')[0]}`, list: skillsComparison.uniqueToB, color: "violet", icon: Target }
            ].map((box, idx) => (
              <div key={idx} className={`bg-${box.color}-50/50 border border-${box.color}-100 rounded-[2rem] p-6 transition-all hover:scale-[1.02]`}>
                <div className="flex items-center gap-2 mb-4">
                  <box.icon size={16} className={`text-${box.color}-500`} />
                  <p className={`text-[11px] font-black uppercase tracking-[0.15em] text-${box.color}-700`}>{box.title}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {box.list?.map(s => (
                    <span key={s} className="text-[10px] font-bold bg-white border border-gray-100 text-gray-600 px-2.5 py-1 rounded-xl shadow-sm">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ─── Main Page ─────────────────────────────────────────────────── */
export default function ComparePage() {
  const navigate = useNavigate()
  const token = authService.getToken()

  // State
  const [tab, setTab] = useState('rank')
  const [cvList, setCvList] = useState([])
  const [loadingCVs, setLoadingCVs] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const [jd, setJd] = useState(() => localStorage.getItem('compare_jd') || '')
  const [ranking, setRanking] = useState(null)
  const [ranking_loading, setRankingLoading] = useState(false)
  const [rankError, setRankError] = useState(null)
  const [selectedForCompare, setSelectedForCompare] = useState([])
  const [compareResult, setCompareResult] = useState(null)
  const [comparing, setComparing] = useState(false)
  const [compareError, setCompareError] = useState(null)

  const headers = { Authorization: `Bearer ${token}` }

  const fetchCVs = useCallback(async () => {
    setLoadingCVs(true)
    try {
      const res = await fetch(`${API}/cv-batch/list`, { headers })
      if (res.ok) setCvList(await res.json())
    } catch (err) { console.error(err) }
    finally { setLoadingCVs(false) }
  }, [])

  useEffect(() => {
    if (!token) { navigate('/auth'); return }
    fetchCVs()
  }, [])

  const handleUpload = async (files) => {
    setUploading(true); setUploadResult(null)
    try {
      const form = new FormData()
      files.forEach(f => form.append('files', f))
      const res = await fetch(`${API}/cv-batch/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form })
      setUploadResult(await res.json())
      await fetchCVs()
    } catch (err) { console.error(err) }
    finally { setUploading(false) }
  }

  const handleRank = async () => {
    if (!jd.trim()) { setRankError('Please paste a job description first'); return }
    setRankingLoading(true); setRankError(null); setCompareResult(null)
    try {
      localStorage.setItem('compare_jd', jd)
      const res = await fetch(`${API}/cv-batch/rank?jd=${encodeURIComponent(jd)}&topN=20`, { headers })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Ranking failed')
      setRanking(data); setTab('rank')
    } catch (err) { setRankError(err.message) }
    finally { setRankingLoading(false) }
  }

  const toggleSelect = (cvId) => {
    setSelectedForCompare(p => p.includes(cvId) ? p.filter(id => id !== cvId) : (p.length >= 2 ? [p[1], cvId] : [...p, cvId]))
    setCompareResult(null)
  }

  const handleCompare = async () => {
    if (selectedForCompare.length !== 2) return
    setComparing(true); setCompareError(null)
    try {
      const res = await fetch(`${API}/cv-batch/compare?cvA=${selectedForCompare[0]}&cvB=${selectedForCompare[1]}&jd=${encodeURIComponent(jd)}`, { headers })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Compare failed')
      setCompareResult(data)
    } catch (err) { setCompareError(err.message) }
    finally { setComparing(false) }
  }

  const handleDelete = async (cvId) => {
    try {
      await fetch(`${API}/cv-batch/${cvId}`, { method: 'DELETE', headers })
      setCvList(prev => prev.filter(cv => cv.cvId !== cvId))
      setSelectedForCompare(prev => prev.filter(id => id !== cvId))
      if (ranking) setRanking(prev => ({ ...prev, rankings: prev.rankings.filter(r => r.cvId !== cvId), total: prev.total - 1 }))
    } catch (err) { console.error(err) }
  }

  const scoreMap = ranking ? Object.fromEntries(ranking.rankings.map(r => [r.cvId, r.matchScore])) : {}

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 selection:bg-cyan-100 selection:text-cyan-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* ── Sticky Modern Header ── */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 transition-all text-slate-400 group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="h-10 w-px bg-slate-100 hidden sm:block"></div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <GitCompare size={20} className="text-cyan-500" /> CV Comparison Hub
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Active Benchmarking Session</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden md:flex bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 flex-col items-end">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Vault Capacity</p>
                <p className="text-sm font-black text-slate-700 leading-none">{cvList.length}<span className="text-slate-300 font-medium">/20</span></p>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── Sidebar Controls (L: 4/12) ── */}
          <div className="lg:col-span-4 space-y-6">

            {/* JD Input Card */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2">
                  <Briefcase size={16} className="text-cyan-500" /> Target Criteria
                </h2>
                <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-500"><Layers size={14}/></div>
              </div>
              <textarea
                value={jd}
                onChange={e => setJd(e.target.value)}
                placeholder="Describe the ideal candidate..."
                className="w-full h-44 px-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-[13px] text-slate-700 placeholder-slate-300 resize-none outline-none focus:bg-white focus:ring-4 focus:ring-cyan-500/5 focus:border-cyan-400 transition-all duration-300"
              />
              <div className="flex items-center justify-between mt-4">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{jd.length} Characters</span>
                <button onClick={() => setJd('')} className="text-[10px] font-black text-rose-400 uppercase tracking-widest hover:text-rose-500">Reset</button>
              </div>
              <button
                onClick={handleRank}
                disabled={ranking_loading || !jd.trim() || cvList.length === 0}
                className="w-full mt-6 group flex items-center justify-center gap-3 py-4 bg-slate-900 hover:bg-black disabled:bg-slate-100 disabled:text-slate-300 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-slate-900/10 active:scale-[0.98]"
              >
                {ranking_loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />}
                {ranking_loading ? 'Processing...' : 'Run Benchmarking'}
              </button>
              {rankError && <p className="mt-4 p-3 bg-rose-50 text-rose-500 text-[11px] font-bold rounded-xl border border-rose-100">{rankError}</p>}
            </div>

            {/* Upload Zone */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
              <h2 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2 mb-6">
                <Upload size={16} className="text-cyan-500" /> Feed Engine
              </h2>
              <UploadZone onUpload={handleUpload} uploading={uploading} />
            </div>

            {/* Selection Floating Action */}
            <AnimatePresence>
              {selectedForCompare.length === 2 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-[2rem] p-8 text-white shadow-2xl shadow-indigo-500/30">
                  <p className="text-sm font-black uppercase tracking-widest opacity-80 mb-1">Dual-Selection Mode</p>
                  <p className="text-xs opacity-60 mb-6 font-medium">Conflict analysis & skill gap comparison ready.</p>
                  <button onClick={handleCompare} disabled={comparing}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-white text-indigo-600 font-black rounded-2xl transition-all hover:scale-105 active:scale-95">
                    {comparing ? <Loader2 size={18} className="animate-spin" /> : <GitCompare size={18} />}
                    {comparing ? 'Matching...' : 'Compare Entities'}
                  </button>
                  <button onClick={() => setSelectedForCompare([])} className="w-full mt-3 text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">De-select all</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Results Main Panel (R: 8/12) ── */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Main Tabs */}
            <div className="flex gap-2 p-1.5 bg-slate-100 rounded-[1.5rem] w-full sm:w-fit">
              {[
                { id: 'rank', label: 'Rankings', icon: BarChart3, count: ranking?.rankings?.length },
                { id: 'cvs',  label: 'Candidate Vault',  icon: Users,    count: cvList.length },
              ].map(({ id, label, icon: Icon, count }) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[13px] font-black transition-all duration-300 ${
                    tab === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}>
                  <Icon size={16} />
                  {label}
                  {count > 0 && <span className={`text-[10px] px-2 py-0.5 rounded-lg ${tab === id ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'}`}>{count}</span>}
                </button>
              ))}
            </div>

            {/* Compare Result Section */}
            <AnimatePresence>
              {compareResult && (
                <ComparePanel result={compareResult} onClose={() => setCompareResult(null)} />
              )}
            </AnimatePresence>

            {/* Tab: Rankings */}
            {tab === 'rank' && (
              <div className="space-y-4">
                {ranking_loading ? (
                  <div className="bg-white rounded-[3rem] border border-slate-100 p-20 text-center shadow-xl shadow-slate-200/30">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <div className="absolute inset-0 rounded-full bg-cyan-100 animate-ping opacity-40"></div>
                      <div className="relative w-20 h-20 bg-white border border-cyan-100 rounded-full flex items-center justify-center">
                        <Loader2 size={32} className="text-cyan-500 animate-spin" />
                      </div>
                    </div>
                    <h3 className="text-lg font-black text-slate-800">Scoring Infrastructure</h3>
                    <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto">Evaluating semantic relevance using BM25 and skill mapping algorithms...</p>
                  </div>
                ) : ranking ? (
                  <div className="space-y-4">
                    {/* Ranking Stats Bar */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/20 p-6 flex flex-wrap gap-10">
                       {[
                         { label: "Scored", val: ranking.total, color: "slate" },
                         { label: "Strong", val: ranking.rankings.filter(r => r.matchScore >= 70).length, color: "emerald" },
                         { label: "At Risk", val: ranking.duplicateWarnings?.length ?? 0, color: "rose" }
                       ].map((s, i) => (
                         <div key={i}>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{s.label}</p>
                           <p className={`text-2xl font-black text-${s.color}-600 leading-none`}>{s.val}</p>
                         </div>
                       ))}
                       <div className="ml-auto flex items-center gap-2">
                          <Search size={14} className="text-slate-300" />
                          <p className="text-[10px] font-bold text-slate-400 italic">Select 2 items for deep comparison</p>
                       </div>
                    </div>
                    
                    {/* List */}
                    <div className="space-y-3">
                      {ranking.rankings.map(item => (
                        <RankRow key={item.cvId} item={item} 
                          onSelect={() => toggleSelect(item.cvId)} 
                          isSelected={selectedForCompare.includes(item.cvId)} 
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-[3rem] border border-dashed border-slate-200 p-20 text-center">
                    <BarChart3 size={48} className="text-slate-100 mx-auto mb-4" />
                    <p className="text-sm font-bold text-slate-400">Analysis Pending</p>
                    <p className="text-[11px] text-slate-300 mt-1">Please configure target criteria and upload CVs.</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab: All CVs */}
            {tab === 'cvs' && (
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-black text-slate-800 tracking-tight">Candidate Vault</h2>
                  <button onClick={fetchCVs} className="p-2.5 bg-slate-50 text-slate-400 hover:text-cyan-500 rounded-xl transition-all">
                    <RefreshCw size={18} />
                  </button>
                </div>
                
                {cvList.length === 0 ? (
                  <div className="text-center py-16">
                    <FileText size={40} className="text-slate-100 mx-auto mb-4" />
                    <p className="text-sm font-bold text-slate-400">Vault is empty</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <AnimatePresence>
                      {cvList.map(cv => (
                        <CvListItem key={cv.cvId} cv={cv}
                          selected={selectedForCompare.includes(cv.cvId)}
                          onToggle={() => toggleSelect(cv.cvId)}
                          onDelete={handleDelete}
                          score={scoreMap[cv.cvId]}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}