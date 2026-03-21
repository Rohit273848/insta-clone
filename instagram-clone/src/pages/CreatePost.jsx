import React, { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, Image, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { postService } from '../services/postService'
import { useAuth } from '../context/AuthContext'
import { Avatar } from '../components/Navbar'
import toast from 'react-hot-toast'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export default function CreatePost() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const fileRef = useRef(null)

  const [step, setStep] = useState('upload') // 'upload' | 'edit' | 'sharing' | 'done'
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [caption, setCaption] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  const processFile = (f) => {
    setError(null)
    if (!ALLOWED_TYPES.includes(f.type)) {
      setError('Only JPEG, PNG, WebP and GIF images are allowed')
      return
    }
    if (f.size > MAX_FILE_SIZE) {
      setError('Image must be smaller than 10 MB')
      return
    }
    setFile(f)
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
      setStep('edit')
    }
    reader.readAsDataURL(f)
  }

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (f) processFile(f)
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f) processFile(f)
  }, [])

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true) }
  const handleDragLeave = () => setDragOver(false)

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true)
    setStep('sharing')
    setError(null)
    try {
      await postService.createPost({ image: file, caption: caption.trim() })
      setStep('done')
      toast.success('Post shared! ✨')
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to share post'
      setError(msg)
      setStep('edit')
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setCaption('')
    setLocation('')
    setStep('upload')
    setError(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="min-h-screen pt-14 pb-20 lg:pt-0 lg:pb-0 lg:pl-64">
      <div className="max-w-2xl mx-auto px-4 py-6 lg:py-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="btn-ghost p-2 -ml-2">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display text-2xl text-white italic">New Post</h1>
            <p className="text-xs text-zinc-500">Share a moment with your followers</p>
          </div>
        </div>

        {/* Step: Upload */}
        {step === 'upload' && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`card p-12 text-center cursor-pointer transition-all duration-300 ${
              dragOver
                ? 'border-brand-500 bg-brand-950/20 shadow-glow-sm'
                : 'hover:border-surface-5 hover:bg-surface-3/30'
            }`}
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-6 transition-all duration-300 ${
              dragOver ? 'bg-brand-600 shadow-glow-brand' : 'bg-surface-3'
            }`}>
              {dragOver ? (
                <Upload size={32} className="text-white animate-bounce" />
              ) : (
                <Image size={32} className="text-zinc-400" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-zinc-200 mb-2">
              {dragOver ? 'Drop it here!' : 'Select a photo'}
            </h2>
            <p className="text-sm text-zinc-500 mb-6">
              Drag and drop or click to browse
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-zinc-600">
              {ALLOWED_TYPES.map((t) => (
                <span key={t} className="px-2 py-1 bg-surface-3 rounded">{t.split('/')[1].toUpperCase()}</span>
              ))}
              <span className="px-2 py-1 bg-surface-3 rounded">Max 10 MB</span>
            </div>
            {error && (
              <div className="mt-5 flex items-center gap-2 p-3 rounded-xl bg-red-950/50 border border-red-900/50 animate-fade-in text-sm text-red-400">
                <AlertCircle size={14} className="shrink-0" /> {error}
              </div>
            )}
          </div>
        )}

        {/* Step: Edit */}
        {(step === 'edit' || step === 'sharing') && preview && (
          <div className="space-y-4 animate-slide-up">
            <div className="card overflow-hidden">
              {/* Image preview */}
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-[500px] object-contain bg-surface-1"
                />
                <button
                  onClick={handleReset}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>

              {/* Form */}
              <div className="p-4 space-y-4">
                {/* User info */}
                <div className="flex items-center gap-3">
                  <Avatar user={user} size="sm" />
                  <span className="text-sm font-semibold text-zinc-200">{user?.username}</span>
                </div>

                {/* Caption */}
                <div>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a caption..."
                    rows={4}
                    maxLength={2200}
                    className="input-field resize-none"
                  />
                  <div className="flex justify-end mt-1">
                    <span className={`text-xs ${caption.length > 2000 ? 'text-red-400' : 'text-zinc-600'}`}>
                      {caption.length}/2200
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="label">Add location (optional)</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mumbai, India"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-950/50 border border-red-900/50 animate-fade-in text-sm text-red-400">
                <AlertCircle size={14} className="shrink-0" /> {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="btn-secondary flex-1"
                disabled={loading}
              >
                Discard
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sharing...
                  </span>
                ) : 'Share Post'}
              </button>
            </div>
          </div>
        )}

        {/* Step: Sharing animation */}
        {step === 'sharing' && (
          <div className="card p-16 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-brand mx-auto flex items-center justify-center mb-4 shadow-glow-brand">
              <span className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin block" />
            </div>
            <p className="text-zinc-300 font-medium">Sharing your post...</p>
          </div>
        )}

        {/* Step: Done */}
        {step === 'done' && (
          <div className="card p-16 text-center animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-green-900/30 border-2 border-green-500 mx-auto flex items-center justify-center mb-4">
              <CheckCircle size={28} className="text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-200 mb-1">Post Shared!</h3>
            <p className="text-sm text-zinc-500">Taking you to your feed...</p>
          </div>
        )}
      </div>
    </div>
  )
}
