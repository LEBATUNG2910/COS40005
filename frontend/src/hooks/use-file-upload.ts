import { useState, useCallback } from 'react'

interface FileUploadState {
  file: File | null
  isUploading: boolean
  uploadProgress: number
  error: string | null
  success: boolean
}

interface UseFileUploadOptions {
  maxSize?: number // in bytes
  allowedTypes?: string[]
  onUploadComplete?: (file: File) => void
  onUploadError?: (error: string) => void
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const {
    maxSize = 10 * 1024 * 1024, 
    allowedTypes = ['.pdf', '.doc', '.docx'],
    onUploadComplete,
    onUploadError
  } = options

  const [state, setState] = useState<FileUploadState>({
    file: null,
    isUploading: false,
    uploadProgress: 0,
    error: null,
    success: false
  })

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`
    }

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!allowedTypes.includes(fileExtension)) {
      return `File type must be one of: ${allowedTypes.join(', ')}`
    }
    return null
  }, [maxSize, allowedTypes])

  const handleFileSelect = useCallback((file: File) => {
    const error = validateFile(file)
    
    if (error) {
      setState(prev => ({
        ...prev,
        error,
        file: null,
        success: false
      }))
      onUploadError?.(error)
      return
    }

    setState(prev => ({
      ...prev,
      file,
      error: null,
      success: false
    }))
  }, [validateFile, onUploadError])

  const uploadFile = useCallback(async () => {
    if (!state.file) return

    setState(prev => ({ ...prev, isUploading: true, uploadProgress: 0, error: null }))

    try {
      // Simulate upload progress
      const simulateUpload = () => {
        return new Promise<void>((resolve) => {
          let progress = 0
          const interval = setInterval(() => {
            progress += Math.random() * 30
            if (progress >= 100) {
              progress = 100
              clearInterval(interval)
              resolve()
            }
            setState(prev => ({ ...prev, uploadProgress: progress }))
          }, 100)
        })
      }

      await simulateUpload()

      setState(prev => ({
        ...prev,
        isUploading: false,
        uploadProgress: 100,
        success: true
      }))

      onUploadComplete?.(state.file)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setState(prev => ({
        ...prev,
        isUploading: false,
        error: errorMessage,
        success: false
      }))
      onUploadError?.(errorMessage)
    }
  }, [state.file, onUploadComplete, onUploadError])

  const resetUpload = useCallback(() => {
    setState({
      file: null,
      isUploading: false,
      uploadProgress: 0,
      error: null,
      success: false
    })
  }, [])

  return {
    ...state,
    handleFileSelect,
    uploadFile,
    resetUpload,
    validateFile
  }
}