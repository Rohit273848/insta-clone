import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Camera, AlertCircle, Mail, Lock, User, AtSign } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  const validate = () => {
    if (!form.fullName.trim()) return 'Full name is required'
    if (!form.username.trim()) return 'Username is required'
    if (form.username.length < 3) return 'Username must be at least 3 characters'
    if (!/^[a-zA-Z0-9_.]+$/.test(form.username)) return 'Username can only contain letters, numbers, _ and .'
    if (!form.email.trim()) return 'Email is required'
    if (!form.password) return 'Password is required'
    if (form.password.length < 6) return 'Password must be at least 6 characters'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setLoading(true)
    setError('')
    try {
      await register(form)
      toast.success('Account created! Welcome to Prism 🎉')
      navigate('/')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed. Try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'fullName', label: 'Full Name', type: 'text', icon: User, placeholder: 'Your full name', autoComplete: 'name' },
    { name: 'username', label: 'Username', type: 'text', icon: AtSign, placeholder: 'your_username', autoComplete: 'username' },
    { name: 'email', label: 'Email', type: 'email', icon: Mail, placeholder: 'you@example.com', autoComplete: 'email' },
  ]

  const strength = (() => {
    const p = form.password
    if (!p) return 0
    let s = 0
    if (p.length >= 6) s++
    if (p.length >= 10) s++
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  })()

  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong']

  return (
    <div className="min-h-screen bg-surface-0 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden bg-surface-1">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-brand-900/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-violet-900/20 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center px-16 animate-fade-in">
          <div className="w-20 h-20 rounded-3xl bg-gradient-brand mx-auto flex items-center justify-center shadow-glow-brand mb-6">
            <Camera size={36} className="text-white" />
          </div>
          <h1 className="font-display text-5xl text-white italic mb-4">Join Prism</h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-xs mx-auto">
            Create an account and start sharing your world through a new perspective.
          </p>
          <div className="mt-12 space-y-4 text-left max-w-xs mx-auto">
            {[
              { emoji: '📸', title: 'Share moments', desc: 'Post photos and tell your story' },
              { emoji: '🔗', title: 'Connect', desc: 'Follow creators you love' },
              { emoji: '❤️', title: 'Engage', desc: 'Like, comment and interact' },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="flex items-center gap-4 p-3 rounded-xl bg-surface-2/50 border border-surface-3">
                <span className="text-2xl">{emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-zinc-200">{title}</p>
                  <p className="text-xs text-zinc-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow-sm">
              <Camera size={20} className="text-white" />
            </div>
            <span className="font-display text-3xl text-white italic">Prism</span>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-3xl text-white mb-2">Create account</h2>
            <p className="text-zinc-500 text-sm">Start sharing your world today</p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-red-950/50 border border-red-900/50 animate-fade-in">
              <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ name, label, type, icon: Icon, placeholder, autoComplete }) => (
              <div key={name}>
                <label className="label">{label}</label>
                <div className="relative">
                  <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            ))}

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  className="input-field pl-10 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Strength bar */}
              {form.password && (
                <div className="mt-2 animate-fade-in">
                  <div className="flex gap-1 mb-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i < strength ? strengthColors[strength - 1] : 'bg-surface-4'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${strengthColors[strength - 1]?.replace('bg-', 'text-') || 'text-zinc-600'}`}>
                    {strength > 0 ? strengthLabels[strength - 1] : ''}
                  </p>
                </div>
              )}
            </div>

            <p className="text-xs text-zinc-600">
              By creating an account you agree to our{' '}
              <span className="text-zinc-400 cursor-pointer hover:underline">Terms</span> and{' '}
              <span className="text-zinc-400 cursor-pointer hover:underline">Privacy Policy</span>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-surface-3 text-center">
            <p className="text-zinc-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
