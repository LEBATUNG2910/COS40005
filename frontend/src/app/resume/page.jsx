"use client"
import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Plus, Trash2, ChevronDown,
  Loader2, Download, RotateCcw, CheckCircle, User,
  Briefcase, GraduationCap, Code2, FolderGit2, Award,
  Languages, Sparkles, Eye, EyeOff, AlertCircle
} from 'lucide-react'
import { authService } from '../../services/authService'

const API = 'http://localhost:3001/api'

/* ─── Helpers ────────────────────────────────────────────────── */
const uid = () => Math.random().toString(36).slice(2, 9)

const SECTIONS = [
  { key: 'personalInfo',   label: 'Info',            icon: User },
  { key: 'summary',        label: 'Summary',         icon: Sparkles },
  { key: 'experience',     label: 'Experience',      icon: Briefcase },
  { key: 'education',      label: 'Education',       icon: GraduationCap },
  { key: 'skills',         label: 'Skills',          icon: Code2 },
  { key: 'projects',       label: 'Projects',        icon: FolderGit2 },
  { key: 'certifications', label: 'Certs',           icon: Award },
  { key: 'languages',      label: 'Lang',            icon: Languages },
]

const EMPTY_DATA = {
  personalInfo: { name: '', email: '', phone: '', location: '', linkedin: '', github: '', website: '' },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
}

/* ─── Input components ───────────────────────────────────────── */
function Field({ label, value, onChange, placeholder, type = 'text', multiline = false, rows = 3 }) {
  const cls = "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none text-sm text-gray-800 placeholder-gray-400 transition-colors"
  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={`${cls} resize-none leading-relaxed`} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      }
    </div>
  )
}

function SectionCard({ title, icon: Icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-full">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-cyan-500" />
          </div>
          <span className="font-semibold text-gray-800 text-sm">{title}</span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Section editors (Experience, Education, etc. - Giữ nguyên logic cũ) ─── */
function PersonalInfoEditor({ data, onChange }) {
  const set = (key, val) => onChange({ ...data, [key]: val })
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Field label="Full Name"    value={data.name}     onChange={v => set('name', v)}     placeholder="Jane Smith" />
      <Field label="Email"        value={data.email}    onChange={v => set('email', v)}    placeholder="jane@example.com" type="email" />
      <Field label="Phone"        value={data.phone}    onChange={v => set('phone', v)}    placeholder="+1 234 567 8900" />
      <Field label="Location"     value={data.location} onChange={v => set('location', v)} placeholder="San Francisco, CA" />
      <Field label="LinkedIn URL" value={data.linkedin} onChange={v => set('linkedin', v)} placeholder="linkedin.com/in/jane" />
      <Field label="GitHub URL"   value={data.github}   onChange={v => set('github', v)}   placeholder="github.com/jane" />
      <div className="sm:col-span-2">
        <Field label="Website" value={data.website} onChange={v => set('website', v)} placeholder="janesmith.dev" />
      </div>
    </div>
  )
}

function ExperienceEditor({ items, onChange }) {
  const add = () => onChange([...items, { _id: uid(), title: '', company: '', location: '', startDate: '', endDate: '', bullets: [''] }])
  const remove = (id) => onChange(items.filter(x => x._id !== id))
  const update = (id, key, val) => onChange(items.map(x => x._id === id ? { ...x, [key]: val } : x))
  const addBullet = (id) => onChange(items.map(x => x._id === id ? { ...x, bullets: [...x.bullets, ''] } : x))
  const removeBullet = (id, bi) => onChange(items.map(x => x._id === id ? { ...x, bullets: x.bullets.filter((_, i) => i !== bi) } : x))
  const updateBullet = (id, bi, val) => onChange(items.map(x => x._id === id ? { ...x, bullets: x.bullets.map((b, i) => i === bi ? val : b) } : x))

  return (
    <div className="space-y-4">
      {items.map((exp, idx) => (
        <div key={exp._id || idx} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50 overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Position {idx + 1}</span>
            <button onClick={() => remove(exp._id)} className="p-1 text-gray-300 hover:text-red-400 transition rounded">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Job Title"  value={exp.title}     onChange={v => update(exp._id, 'title', v)}     placeholder="Senior Engineer" />
            <Field label="Company"    value={exp.company}   onChange={v => update(exp._id, 'company', v)}   placeholder="Acme Corp" />
            <Field label="Location"   value={exp.location}  onChange={v => update(exp._id, 'location', v)}  placeholder="Remote" />
            <div className="grid grid-cols-2 gap-2">
              <Field label="Start"    value={exp.startDate} onChange={v => update(exp._id, 'startDate', v)} placeholder="Jan 2022" />
              <Field label="End"      value={exp.endDate}   onChange={v => update(exp._id, 'endDate', v)}   placeholder="Present" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Bullets</label>
            <div className="space-y-2">
              {exp.bullets.map((b, bi) => (
                <div key={bi} className="flex gap-2">
                  <span className="text-gray-300 mt-2.5 text-xs">•</span>
                  <input value={b} onChange={e => updateBullet(exp._id, bi, e.target.value)}
                    placeholder="Key achievement..."
                    className="flex-1 min-w-0 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none text-sm text-gray-800 placeholder-gray-400 transition-colors" />
                  {exp.bullets.length > 1 && (
                    <button onClick={() => removeBullet(exp._id, bi)} className="p-1 text-gray-200 hover:text-red-400 transition rounded mt-1">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => addBullet(exp._id)}
              className="mt-2 flex items-center gap-1 text-xs text-cyan-500 hover:text-cyan-600 font-semibold transition">
              <Plus className="w-3 h-3" /> Add bullet
            </button>
          </div>
        </div>
      ))}
      <button onClick={add}
        className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 hover:border-cyan-300 text-gray-400 hover:text-cyan-500 rounded-xl transition-all text-sm font-semibold">
        <Plus className="w-4 h-4" /> Add Experience
      </button>
    </div>
  )
}

function EducationEditor({ items, onChange }) {
  const add = () => onChange([...items, { _id: uid(), degree: '', school: '', location: '', startDate: '', endDate: '', gpa: '' }])
  const remove = (id) => onChange(items.filter(x => x._id !== id))
  const update = (id, key, val) => onChange(items.map(x => x._id === id ? { ...x, [key]: val } : x))

  return (
    <div className="space-y-4">
      {items.map((edu, idx) => (
        <div key={edu._id || idx} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Education {idx + 1}</span>
            <button onClick={() => remove(edu._id)} className="p-1 text-gray-300 hover:text-red-400 transition rounded">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <Field label="Degree" value={edu.degree} onChange={v => update(edu._id, 'degree', v)} placeholder="B.Sc Computer Science" />
            </div>
            <Field label="School"   value={edu.school}    onChange={v => update(edu._id, 'school', v)}    placeholder="MIT" />
            <Field label="Location" value={edu.location}  onChange={v => update(edu._id, 'location', v)}  placeholder="Cambridge, MA" />
            <Field label="Start"    value={edu.startDate} onChange={v => update(edu._id, 'startDate', v)} placeholder="2018" />
            <Field label="End"      value={edu.endDate}   onChange={v => update(edu._id, 'endDate', v)}   placeholder="2022" />
            <Field label="GPA"      value={edu.gpa}       onChange={v => update(edu._id, 'gpa', v)}       placeholder="3.9" />
          </div>
        </div>
      ))}
      <button onClick={add}
        className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 hover:border-cyan-300 text-gray-400 hover:text-cyan-500 rounded-xl transition-all text-sm font-semibold">
        <Plus className="w-4 h-4" /> Add Education
      </button>
    </div>
  )
}

function SkillsEditor({ items, onChange }) {
  const [input, setInput] = useState('')
  const add = () => {
    const trimmed = input.trim()
    if (!trimmed || items.includes(trimmed)) return
    onChange([...items, trimmed]); setInput('')
  }
  const remove = (s) => onChange(items.filter(x => x !== s))
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {items.map(s => (
          <span key={s} className="flex items-center gap-1 bg-cyan-50 text-cyan-700 border border-cyan-200 px-3 py-1 rounded-full text-xs font-semibold">
            {s}
            <button onClick={() => remove(s)} className="ml-0.5 text-cyan-400 hover:text-red-400 transition">
              <Trash2 className="w-2.5 h-2.5" />
            </button>
          </span>
        ))}
        {items.length === 0 && <p className="text-xs text-gray-400">No skills added yet</p>}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="Skill..."
          className="flex-1 min-w-0 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none text-sm text-gray-800 placeholder-gray-400 transition-colors" />
        <button onClick={add}
          className="px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition text-sm font-semibold">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function ProjectsEditor({ items, onChange }) {
  const add = () => onChange([...items, { _id: uid(), name: '', tech: [], description: '', url: '' }])
  const remove = (id) => onChange(items.filter(x => x._id !== id))
  const update = (id, key, val) => onChange(items.map(x => x._id === id ? { ...x, [key]: val } : x))

  return (
    <div className="space-y-4">
      {items.map((proj, idx) => (
        <div key={proj._id || idx} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Project {idx + 1}</span>
            <button onClick={() => remove(proj._id)} className="p-1 text-gray-300 hover:text-red-400 transition rounded">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <Field label="Project Name" value={proj.name} onChange={v => update(proj._id, 'name', v)} placeholder="Portfolio" />
          <Field label="Tech (comma separated)" value={Array.isArray(proj.tech) ? proj.tech.join(', ') : proj.tech}
            onChange={v => update(proj._id, 'tech', v.split(',').map(t => t.trim()).filter(Boolean))} placeholder="React, Tailwind" />
          <Field label="Description" value={proj.description} onChange={v => update(proj._id, 'description', v)}
            placeholder="Impact..." multiline rows={2} />
          <Field label="URL" value={proj.url} onChange={v => update(proj._id, 'url', v)} placeholder="https://..." />
        </div>
      ))}
      <button onClick={add}
        className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 hover:border-cyan-300 text-gray-400 hover:text-cyan-500 rounded-xl transition-all text-sm font-semibold">
        <Plus className="w-4 h-4" /> Add Project
      </button>
    </div>
  )
}

function ListEditor({ items, onChange, placeholder }) {
  const [input, setInput] = useState('')
  const add = () => {
    const t = input.trim(); if (!t) return
    onChange([...items, t]); setInput('')
  }
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="flex-1 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 truncate">{item}</span>
          <button onClick={() => remove(i)} className="p-1.5 text-gray-300 hover:text-red-400 transition rounded">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()}
          placeholder={placeholder}
          className="flex-1 min-w-0 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none text-sm text-gray-800 placeholder-gray-400 transition-colors" />
        <button onClick={add} className="px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

/* ─── Live Preview ───────────────────────────────────────────── */
function ResumePreview({ data }) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications, languages } = data

  return (
    <div className="bg-white text-gray-900 font-sans text-[11px] leading-relaxed"
      style={{ fontFamily: "'Georgia', serif", minHeight: '297mm', width: '100%' }}>
      {/* Header */}
      <div className="bg-gray-900 text-white px-8 py-6">
        <h1 className="text-2xl font-bold tracking-tight break-words">{p.name || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-gray-300 text-[10px]">
          {p.email    && <span className="break-all">{p.email}</span>}
          {p.phone    && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span className="break-all">{p.linkedin}</span>}
          {p.github   && <span className="break-all">{p.github}</span>}
        </div>
      </div>
      <div className="px-8 py-5 space-y-4">
        {summary && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-2">Summary</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{summary}</p>
          </div>
        )}
        {experience.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-2">Experience</h2>
            <div className="space-y-3">
              {experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-gray-900">{exp.title}</p>
                      <p className="text-gray-500">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                    </div>
                    <p className="text-gray-400 flex-shrink-0 text-right">{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</p>
                  </div>
                  <ul className="mt-1 space-y-0.5">
                    {exp.bullets?.filter(b => b.trim()).map((b, bi) => (
                      <li key={bi} className="flex gap-2"><span className="text-gray-400 flex-shrink-0">•</span>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
        {education.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-2">Education</h2>
            <div className="space-y-2">
              {education.map((edu, i) => (
                <div key={i} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-gray-900">{edu.degree}</p>
                    <p className="text-gray-500">{edu.school}{edu.location ? ` · ${edu.location}` : ''}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</p>
                  </div>
                  <p className="text-gray-400 flex-shrink-0 text-right">{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {skills.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-2">Skills</h2>
            <p className="text-gray-700">{skills.join(' · ')}</p>
          </div>
        )}
        {projects.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-2">Projects</h2>
            <div className="space-y-2">
              {projects.map((proj, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900">{proj.name}</p>
                    {proj.tech?.length > 0 && <span className="text-gray-400">— {Array.isArray(proj.tech) ? proj.tech.join(', ') : proj.tech}</span>}
                  </div>
                  {proj.description && <p className="text-gray-700 mt-0.5">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        {certifications.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-2">Certifications</h2>
            <ul className="space-y-0.5">
              {certifications.map((c, i) => <li key={i} className="flex gap-2"><span className="text-gray-400">•</span>{c}</li>)}
            </ul>
          </div>
        )}
        {languages.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-2">Languages</h2>
            <p className="text-gray-700">{languages.join(' · ')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function ResumeBuilder() {
  const navigate   = useNavigate()
  const token      = authService.getToken()
  const previewRef = useRef(null)

  const [data, setData]           = useState(EMPTY_DATA)
  const [activeSection, setActiveSection] = useState('personalInfo')
  const [loading, setLoading]     = useState(true)
  const [saved, setSaved]         = useState(false)
  const [exporting, setExporting] = useState(false)
  const [showPreview, setShowPreview] = useState(false) // Mặc định tắt trên mobile
  const [error, setError]         = useState(null)
  const [parseError, setParseError] = useState(false)

  const attachIds = (d) => ({
    ...d,
    experience:  (d.experience  || []).map(x => ({ _id: uid(), ...x })),
    education:   (d.education   || []).map(x => ({ _id: uid(), ...x })),
    projects:    (d.projects    || []).map(x => ({ _id: uid(), ...x })),
  })

  const stripIds = (d) => ({
    ...d,
    experience: d.experience.map(({ _id, ...rest }) => rest),
    education:  d.education.map(({ _id, ...rest }) => rest),
    projects:   d.projects.map(({ _id, ...rest }) => rest),
  })

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/resume/data`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const json = await res.json()
        if (json.hasData) {
          setData(attachIds(json))
          setLoading(false)
          return
        }
        const parseRes = await fetch(`${API}/resume/parse`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!parseRes.ok) throw new Error('parse_failed')
        const parsed = await parseRes.json()
        setData(attachIds(parsed))
      } catch (err) {
        setParseError(true)
        setData(attachIds(EMPTY_DATA))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  const saveTimeout = useRef(null)
  const autoSave = useCallback((newData) => {
    clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(async () => {
      try {
        await fetch(`${API}/resume/data`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(stripIds(newData)),
        })
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } catch {}
    }, 1200)
  }, [token])

  const update = (key, val) => {
    const next = { ...data, [key]: val }
    setData(next)
    autoSave(next)
  }

  const handleReparse = async () => {
    setLoading(true); setError(null)
    try {
      const res = await fetch(`${API}/resume/reparse`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('reparse failed')
      const parsed = await res.json()
      setData(attachIds(parsed))
      setParseError(false)
    } catch {
      setError('Could not re-parse CV.')
    } finally { setLoading(false) }
  }

  const handleExport = async () => {
    setExporting(true); setError(null)
    try {
      await fetch(`${API}/resume/data`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(stripIds(data)),
      })
      const res = await fetch(`${API}/resume/export`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `resume-${Date.now()}.pdf`
      a.click(); URL.revokeObjectURL(url)
    } catch (err) {
      setError(err.message)
    } finally { setExporting(false) }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-300 animate-ping opacity-50" />
            <div className="w-16 h-16 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-cyan-500 animate-pulse" />
            </div>
          </div>
          <p className="text-lg font-bold text-gray-900">Parsing your CV…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Top Bar (Responsive optimized) ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-2">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition font-semibold text-sm">
            <ArrowLeft className="w-4 h-4" /> <span className="hidden xs:inline">Back</span>
          </button>

          <div className="flex items-center gap-1.5">
            {saved && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="hidden md:flex items-center gap-1 text-xs text-emerald-500 font-semibold mr-2">
                <CheckCircle className="w-3.5 h-3.5" /> Saved
              </motion.span>
            )}

            <button onClick={handleReparse}
              className="flex items-center gap-1.5 px-2 py-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition text-xs font-semibold">
              <RotateCcw className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Reset</span>
            </button>

            <button onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1.5 px-2 py-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition text-xs font-semibold lg:hidden">
              {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden xs:inline">{showPreview ? 'Hide' : 'Preview'}</span>
            </button>

            <button onClick={handleExport} disabled={exporting}
              className="flex items-center gap-2 px-3 py-2 bg-gray-900 hover:bg-black disabled:opacity-50 text-white font-semibold rounded-xl transition-all active:scale-95 text-xs sm:text-sm">
              {exporting
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> <span className="hidden xs:inline">...</span></>
                : <><Download className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Export</span></>
              }
            </button>
          </div>
        </div>
      </div>

      {/* ── Error banner ── */}
      {(error || parseError) && (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 mt-4">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-orange-800 font-medium">
                {parseError ? 'Auto-parsing failed. Please fill manually.' : error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Main layout ── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* LEFT: Editor (Always full width on mobile) */}
          <div className={`w-full lg:w-[520px] flex-shrink-0 space-y-4 ${showPreview ? 'hidden lg:block' : 'block'}`}>
            <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-2 no-scrollbar">
              {SECTIONS.map(({ key, label, icon: Icon }) => (
                <button key={key}
                  onClick={() => {
                    setActiveSection(key)
                    document.getElementById(`section-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-all border whitespace-nowrap ${
                    activeSection === key
                      ? 'bg-cyan-500 text-white border-cyan-500'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-cyan-300'
                  }`}>
                  <Icon className="w-3 h-3" /> {label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div id="section-personalInfo"><SectionCard title="Personal Info" icon={User}><PersonalInfoEditor data={data.personalInfo} onChange={v => update('personalInfo', v)} /></SectionCard></div>
              <div id="section-summary"><SectionCard title="Summary" icon={Sparkles} defaultOpen={false}><Field label="Professional Summary" value={data.summary} onChange={v => update('summary', v)} multiline rows={4} /></SectionCard></div>
              <div id="section-experience"><SectionCard title="Experience" icon={Briefcase}><ExperienceEditor items={data.experience} onChange={v => update('experience', v)} /></SectionCard></div>
              <div id="section-education"><SectionCard title="Education" icon={GraduationCap} defaultOpen={false}><EducationEditor items={data.education} onChange={v => update('education', v)} /></SectionCard></div>
              <div id="section-skills"><SectionCard title="Skills" icon={Code2} defaultOpen={false}><SkillsEditor items={data.skills} onChange={v => update('skills', v)} /></SectionCard></div>
              <div id="section-projects"><SectionCard title="Projects" icon={FolderGit2} defaultOpen={false}><ProjectsEditor items={data.projects} onChange={v => update('projects', v)} /></SectionCard></div>
              <div id="section-certifications"><SectionCard title="Certifications" icon={Award} defaultOpen={false}><ListEditor items={data.certifications} onChange={v => update('certifications', v)} placeholder="AWS..." /></SectionCard></div>
              <div id="section-languages"><SectionCard title="Languages" icon={Languages} defaultOpen={false}><ListEditor items={data.languages} onChange={v => update('languages', v)} placeholder="English..." /></SectionCard></div>
            </div>
          </div>

          {/* RIGHT: Live Preview (Full screen toggle on mobile) */}
          <div className={`flex-1 min-w-0 ${showPreview ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-20 w-full overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Preview</p>
                <span className="text-xs text-gray-400 font-mono">Template #1</span>
              </div>
              <div className="overflow-auto rounded-xl shadow-xl border border-gray-200 bg-white no-scrollbar"
                style={{ maxHeight: 'calc(100vh - 120px)' }}>
                {/* Responsive Scale: Scale 0.85 on desktop, Scale 1 or custom on mobile */}
                <div ref={previewRef} 
                     className="origin-top-left" 
                     style={{ 
                       transform: window.innerWidth < 1024 ? 'scale(1)' : 'scale(0.85)', 
                       width: window.innerWidth < 1024 ? '100%' : '117.6%' 
                     }}>
                  <ResumePreview data={data} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}