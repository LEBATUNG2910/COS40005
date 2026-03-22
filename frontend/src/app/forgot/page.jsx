"use client"
import { useState } from 'react'
import { Link } from 'react-router-dom' // Sử dụng Link từ react-router-dom
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Mail, CheckCircle, Loader2, AlertCircle, ArrowRight } from 'lucide-react'

const API = 'http://localhost:3001/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true); setError(null)
    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Something went wrong')
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">

        {/* Thay đổi từ <a> sang <Link> để chuẩn SPA */}
        <Link to="/auth" className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm mb-6 transition">
          <ArrowLeft size={16} /> Back to sign in
        </Link>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                We sent a password reset link to <strong>{email}</strong>.<br />
                It expires in 1 hour.
              </p>
              <button onClick={() => { setSuccess(false); setEmail('') }}
                className="text-cyan-600 hover:text-cyan-700 text-sm font-medium">
                Try a different email
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="w-12 h-12 bg-cyan-50 border border-cyan-200 rounded-xl flex items-center justify-center mb-5">
                <Mail size={22} className="text-cyan-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Forgot password?</h2>
              <p className="text-gray-500 text-sm mb-6">Enter your email and we'll send you a reset link.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-sm">
                    <AlertCircle size={15} /> {error}
                  </div>
                )}

                <button type="submit" disabled={loading || !email.trim()}
                  className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2">
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : 'Send Reset Link'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}