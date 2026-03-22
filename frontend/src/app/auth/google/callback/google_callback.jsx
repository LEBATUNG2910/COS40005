"use client"
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { authService } from '../../../../services/authService'

export default function GoogleCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const accessToken  = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')

    if (accessToken && refreshToken) {
      // Lưu token — rememberMe=true vì đăng nhập Google thường là remember
      authService.saveToken(accessToken, refreshToken, true)
      navigate('/home')
    } else {
      navigate('/auth?error=google_failed')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={32} className="text-cyan-500 animate-spin" />
        <p className="text-gray-500 text-sm">Signing you in with Google...</p>
      </div>
    </div>
  )
}
