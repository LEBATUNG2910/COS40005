"use client"
import { useState, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Upload, FileText, Check, X, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { motion } from "framer-motion"
import { useFileStore } from '../../context/FileContext'
import { authService } from '../../services/authService'

/* ─── Shared Step Nav (same as analyst page) ─────────────────── */
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

export default function CVUpload() {
  const [isDragOver, setIsDragOver]       = useState(false)
  const [file, setFile]                   = useState(null)
  const [isUploading, setIsUploading]     = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError]                 = useState(null)
  const [success, setSuccess]             = useState(false)

  const fileInputRef = useRef(null)
  const navigate = useNavigate()
  const { setUploadedFile, selectedTemplateId } = useFileStore()

  const handleFileSelect = (selectedFile) => {
    const ext = '.' + selectedFile.name.split('.').pop().toLowerCase()
    if (ext !== '.pdf') { setError('Only PDF files are allowed'); return }
    if (selectedFile.size > 10 * 1024 * 1024) { setError('File size must be less than 10MB'); return }
    setError(null); setSuccess(false); setUploadProgress(0); setFile(selectedFile)
  }

  const resetUpload = () => { setFile(null); setError(null); setSuccess(false); setUploadProgress(0) }

  const handleUpload = async () => {
    if (!file) return
    setIsUploading(true); setError(null)
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => prev < 90 ? prev + 5 : prev)
    }, 150)
    try {
      const token = authService.getToken()
      const formData = new FormData()
      formData.append('file', file)
      formData.append('templateId', String(selectedTemplateId || 1))

      const [res] = await Promise.all([
        fetch('http://localhost:3001/api/cv/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        }),
        new Promise(resolve => setTimeout(resolve, 1200))
      ])

      clearInterval(progressInterval)
      setUploadProgress(100)
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Upload failed')
      setTimeout(() => { setUploadedFile(file); setSuccess(true) }, 300)
    } catch (err) {
      clearInterval(progressInterval); setError(err.message); setUploadProgress(0)
    } finally {
      setTimeout(() => setIsUploading(false), 500)
    }
  }

  const handleDragOver   = useCallback((e) => { e.preventDefault(); setIsDragOver(true) }, [])
  const handleDragLeave  = useCallback((e) => { e.preventDefault(); setIsDragOver(false) }, [])
  const handleDrop       = useCallback((e) => {
    e.preventDefault(); setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) handleFileSelect(files[0])
  }, [])
  const handleFileInputChange = useCallback((e) => {
    if (e.target.files?.length > 0) handleFileSelect(e.target.files[0])
  }, [])
  const triggerFileInput = useCallback(() => fileInputRef.current?.click(), [])

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-white pt-6 sm:pt-8">

      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          <Link to="/process" className="flex items-center gap-1.5 text-gray-600 hover:text-black transition-colors font-semibold text-sm sm:text-base">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Back</span>
          </Link>
          <StepNav currentStep={1} />
          <div className="w-16" /> {/* spacer to balance Back button */}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Upload Your CV</h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your resume and let our AI-powered system help you optimize it.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Upload className="w-5 h-5 text-cyan-500" /> CV Upload
            </CardTitle>
            <CardDescription>Upload your CV in PDF format (max 10MB)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {/* Drop zone */}
              <div
                onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={triggerFileInput}
                className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-colors ${
                  isDragOver || file ? 'border-cyan-400 bg-cyan-50' : 'border-gray-300 hover:border-cyan-400 hover:bg-gray-50'
                }`}
              >
                <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileInputChange} className="hidden" />
                {!file ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-cyan-100 rounded-full flex items-center justify-center">
                      <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-500" />
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-medium text-gray-900">Drag and drop your CV here</p>
                      <p className="text-gray-500 mt-1 text-sm">or click to browse files</p>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400">PDF only · max 10MB</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-cyan-100 rounded-full flex items-center justify-center">
                      <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-500" />
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-medium text-gray-900 break-all px-4">{file.name}</p>
                      <p className="text-gray-500 mt-1 text-sm">{formatFileSize(file.size)}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); resetUpload() }}
                      className="text-gray-500 hover:text-red-500 text-xs sm:text-sm">
                      <X className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-3 sm:p-4 flex items-center gap-3">
                  <Check className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  <p className="text-cyan-700 text-sm font-medium">CV uploaded successfully! Text extracted and ready to analyze.</p>
                </div>
              )}

              {/* Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Uploading & extracting text...</span>
                    <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div className="bg-cyan-500 h-2 rounded-full"
                      initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }} />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {file && !success && (
                  <Button onClick={handleUpload} disabled={isUploading}
                    className="w-full sm:w-auto min-w-[140px] bg-cyan-500 hover:bg-cyan-600 text-white disabled:bg-cyan-300 disabled:cursor-not-allowed">
                    {isUploading ? 'Uploading...' : <><Upload className="w-4 h-4 mr-2" />Upload CV</>}
                  </Button>
                )}
                {success && (
                  <>
                    <Button onClick={resetUpload} variant="outline"
                      className="w-full sm:w-auto border-cyan-500 text-cyan-500 hover:bg-cyan-50">
                      Upload Another
                    </Button>
                    <Button onClick={() => navigate('/selection')}
                      className="w-full sm:w-auto min-w-[160px] bg-cyan-500 hover:bg-cyan-600 text-white">
                      <Check className="w-4 h-4 mr-2" /> Choose Template
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}