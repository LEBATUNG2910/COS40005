"use client"
import { useState, useRef, useCallback } from 'react'
import { Upload, FileText, Check, X, AlertCircle, Download } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { useFileUpload } from '../hooks/use-file-upload'

//Function to upload CV
export default function CVUpload() {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const {
    file,
    isUploading,
    uploadProgress,
    error,
    success,
    handleFileSelect,
    uploadFile,
    resetUpload
  } = useFileUpload({
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['.pdf', '.doc', '.docx'],
    onUploadComplete: (file) => {
      console.log('Upload completed:', file.name)
    },
    onUploadError: (error) => {
      console.error('Upload error:', error)
    }
  })

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleFileInputChange = useCallback((e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click()
  }, [fileInputRef])

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upload Your CV
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your resume and let our AI-powered system help you optimize it for better job opportunities.
          </p>
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-cyan-500" />
              CV Upload
            </CardTitle>
            <CardDescription>
              Upload your CV in PDF, DOC, or DOCX format (max 10MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={`
                  relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                  ${isDragOver 
                    ? 'border-cyan-400 bg-cyan-50' 
                    : file 
                      ? 'border-cyan-400 bg-cyan-50' 
                      : 'border-gray-300 hover:border-cyan-400 hover:bg-gray-50'
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                
                {!file ? (
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-cyan-500" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        Drag and drop your CV here
                      </p>
                      <p className="text-gray-500 mt-1">
                        or click to browse files
                      </p>
                    </div>
                    <div className="text-sm text-gray-400">
                      Supported formats: PDF, DOC, DOCX (max 10MB)
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center">
                      <FileText className="w-8 h-8 text-cyan-500" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        {file.name}
                      </p>
                      <p className="text-gray-500 mt-1">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        resetUpload()
                      }}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 flex items-center gap-3">
                  <Check className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  <p className="text-cyan-700">CV uploaded successfully!</p>
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Uploading...
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round(uploadProgress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex gap-4 justify-center">
                {file && !success && (
                  <Button
                    onClick={uploadFile}
                    disabled={isUploading}
                    className="min-w-[120px] bg-cyan-500 hover:bg-cyan-600 text-white"
                  >
                    {isUploading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Uploading...
                      </div>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload CV
                      </>
                    )}
                  </Button>
                )}
                
                {success && (
                  <>
                    <Button
                      onClick={resetUpload}
                      variant="outline"
                      className="border-cyan-500 text-cyan-500 hover:bg-cyan-50"
                    >
                      Upload Another
                    </Button>
                    <Button className="min-w-[120px] bg-cyan-500 hover:bg-cyan-600 text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                  </>
                )}
              </div>

              {/* Tips */}
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                <h3 className="font-medium text-cyan-900 mb-2">Tips for better results:</h3>
                <ul className="text-sm text-cyan-700 space-y-1">
                  <li>Use a well-formatted PDF for best analysis</li>
                  <li>Ensure your CV includes contact information</li>
                  <li>Include relevant keywords for your target industry</li>
                  <li>Keep your CV concise and well-organized</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}