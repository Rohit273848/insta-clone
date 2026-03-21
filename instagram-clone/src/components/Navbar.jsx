import React, { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Home, Search, PlusSquare, User, LogOut,
  Bell, Settings, Compass, X, Camera
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/userService'
import toast from 'react-hot-toast'

function Avatar({ user, size = 'sm' }) {
  const sizeMap = { xs: 'w-6 h-6', sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' }
  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.username}
        className={`${sizeMap[size]} avatar`}
      />
    )
  }
  const initials = user?.username?.[0]?.toUpperCase() || '?'
  return (
    <div className={`${sizeMap[size]} rounded-full bg-gradient-brand flex items-center justify-center text-white font-semibold text-xs`}>
      {initials}
    </div>
  )
}

export { Avatar }

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const searchRef = useRef(null)
  const menuRef = useRef(null)
  const searchTimeout = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false)
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    const val = e.target.value
    setSearchQuery(val)
    clearTimeout(searchTimeout.current)
    if (!val.trim()) { setSearchResults([]); return }
    searchTimeout.current = setTimeout(async () => {
      try {
        const results = await userService.searchUsers(val)
        setSearchResults(results?.users || results || [])
        setSearchOpen(true)
      } catch { setSearchResults([]) }
    }, 400)
  }

  const handleLogout = () => {
    logout()
    toast.success('Signed out successfully')
    navigate('/login')
  }

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/explore', icon: Compass, label: 'Explore' },
    { to: '/create', icon: PlusSquare, label: 'Create' },
    { to: `/profile/${user?.username}`, icon: User, label: 'Profile' },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col border-r border-surface-3 bg-surface-0 z-40 py-6 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 px-4 mb-8 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-brand transition-shadow">
            <Camera size={18} className="text-white" />
          </div>
          <span className="font-display text-2xl text-white italic">Prism</span>
        </Link>

        {/* Search */}
        <div ref={searchRef} className="relative mb-4 px-1">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearch}
              className="input-field pl-9 py-2.5 text-sm"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setSearchResults([]); setSearchOpen(false) }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                <X size={14} />
              </button>
            )}
          </div>
          {/* Search dropdown */}
          {searchOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 card border-surface-4 z-50 max-h-64 overflow-y-auto animate-scale-in">
              {searchResults.map((u) => (
                <Link
                  key={u._id}
                  to={`/profile/${u.username}`}
                  onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-surface-3 transition-colors"
                >
                  <Avatar user={u} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{u.username}</p>
                    <p className="text-xs text-zinc-500">{u.fullName}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1 px-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-link group ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} strokeWidth={1.75} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User menu */}
        <div ref={menuRef} className="relative mt-4 px-1">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-2 transition-colors"
          >
            <Avatar user={user} size="sm" />
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-sm font-medium text-zinc-200 truncate">{user?.username}</p>
              <p className="text-xs text-zinc-500 truncate">{user?.fullName || user?.email}</p>
            </div>
          </button>
          {menuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 card border-surface-4 overflow-hidden animate-scale-in">
              <Link
                to={`/profile/${user?.username}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-surface-3 transition-colors text-sm text-zinc-300"
                onClick={() => setMenuOpen(false)}
              >
                <User size={16} /> Your Profile
              </Link>
              <div className="divider" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-3 transition-colors text-sm text-red-400 hover:text-red-300"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 glass border-b border-surface-3 h-14 flex items-center px-4 gap-3">
        <Link to="/" className="flex items-center gap-2 mr-auto">
          <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center">
            <Camera size={14} className="text-white" />
          </div>
          <span className="font-display text-xl text-white italic">Prism</span>
        </Link>
        <Link to="/create" className="btn-ghost p-2">
          <PlusSquare size={22} strokeWidth={1.75} />
        </Link>
        <Link to={`/profile/${user?.username}`} className="btn-ghost p-2">
          <Avatar user={user} size="xs" />
        </Link>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-surface-3 h-16 flex items-center justify-around px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${isActive ? 'text-white' : 'text-zinc-500'}`
            }
          >
            <Icon size={22} strokeWidth={1.75} />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}
