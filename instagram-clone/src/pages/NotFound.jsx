import React from 'react'
import { Link } from 'react-router-dom'
import { Camera, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-surface-2 mx-auto flex items-center justify-center mb-6 border border-surface-3">
          <Camera size={32} className="text-zinc-600" />
        </div>
        <h1 className="font-display text-7xl text-white italic mb-2">404</h1>
        <p className="text-xl font-semibold text-zinc-400 mb-2">Page not found</p>
        <p className="text-zinc-600 text-sm mb-8 max-w-xs mx-auto">
          Sorry, this page doesn't exist or has been removed.
        </p>
        <Link to="/" className="btn-primary inline-flex">
          <Home size={16} /> Back to Home
        </Link>
      </div>
    </div>
  )
}
