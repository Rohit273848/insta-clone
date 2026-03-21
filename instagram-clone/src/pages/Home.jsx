import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw, TrendingUp, Users } from 'lucide-react'
import { postService } from '../services/postService'
import { userService } from '../services/userService'
import { useAuth } from '../context/AuthContext'
import PostCard, { PostCardSkeleton } from '../components/PostCard'
import UserCard from '../components/UserCard'
import { Avatar } from '../components/Navbar'
import toast from 'react-hot-toast'

function StoriesBar({ user }) {
  const [stories] = useState([
    { id: 'create', isCreate: true },
    ...Array.from({ length: 6 }, (_, i) => ({
      id: i,
      username: `user_${i + 1}`,
      avatar: null,
      seen: i > 2,
    })),
  ])

  return (
    <div className="card p-4 mb-4">
      <div className="stories-scroll">
        {stories.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-1.5 shrink-0">
            {s.isCreate ? (
              <Link to="/create" className="flex flex-col items-center gap-1.5 group">
                <div className="w-14 h-14 rounded-full bg-surface-3 border-2 border-dashed border-surface-5 flex items-center justify-center group-hover:border-brand-600 transition-colors">
                  <span className="text-xl text-zinc-400 group-hover:text-brand-400 transition-colors">+</span>
                </div>
                <span className="text-[10px] text-zinc-500 w-14 text-center truncate">Your story</span>
              </Link>
            ) : (
              <div className="flex flex-col items-center gap-1.5 cursor-pointer">
                <div className={`p-0.5 rounded-full ${s.seen ? 'bg-surface-4' : 'bg-gradient-brand'}`}>
                  <div className="p-0.5 rounded-full bg-surface-0">
                    <Avatar user={{ username: s.username }} size="sm" />
                  </div>
                </div>
                <span className="text-[10px] text-zinc-500 w-14 text-center truncate">{s.username}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function SuggestedUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    userService.getSuggestedUsers()
      .then((data) => setUsers(data?.users || data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (!loading && users.length === 0) return null

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Users size={16} className="text-zinc-500" />
        <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Suggested</h3>
      </div>
      <div className="space-y-1">
        {loading
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className="w-8 h-8 rounded-full skeleton shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 w-24 skeleton rounded" />
                  <div className="h-2 w-16 skeleton rounded" />
                </div>
              </div>
            ))
          : users.slice(0, 5).map((u) => (
              <UserCard key={u._id} user={u} compact />
            ))}
      </div>
    </div>
  )
}

export default function Home() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchPosts = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const data = await postService.getAllPosts()
      setPosts(data?.posts || data || [])
    } catch (err) {
      setError('Failed to load posts. Pull to refresh.')
      if (!isRefresh) toast.error('Could not load posts')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const handlePostDelete = (deletedId) => {
    setPosts((prev) => prev.filter((p) => p._id !== deletedId))
  }

  return (
    <div className="min-h-screen pt-14 pb-20 lg:pt-0 lg:pb-0 lg:pl-64">
      <div className="max-w-5xl mx-auto px-4 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main Feed */}
          <div className="flex-1 min-w-0 max-w-xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display text-2xl text-white italic">Your Feed</h1>
                <p className="text-xs text-zinc-500 mt-0.5">Latest from people you follow</p>
              </div>
              <button
                onClick={() => fetchPosts(true)}
                disabled={refreshing}
                className="btn-ghost p-2 rounded-xl"
                title="Refresh feed"
              >
                <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
              </button>
            </div>

            {/* Stories */}
            <StoriesBar user={user} />

            {/* Posts */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => <PostCardSkeleton key={i} />)}
              </div>
            ) : error ? (
              <div className="card p-8 text-center animate-fade-in">
                <p className="text-zinc-500 mb-4">{error}</p>
                <button onClick={() => fetchPosts()} className="btn-secondary">
                  Try Again
                </button>
              </div>
            ) : posts.length === 0 ? (
              <div className="card p-10 text-center animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-surface-3 mx-auto flex items-center justify-center mb-4">
                  <TrendingUp size={24} className="text-zinc-500" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-2">Your feed is empty</h3>
                <p className="text-zinc-500 text-sm mb-6">Follow some users to see their posts here</p>
                <Link to="/explore" className="btn-primary">
                  Explore Users
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} onDelete={handlePostDelete} />
                ))}
                <div className="py-8 text-center">
                  <p className="text-zinc-600 text-sm">You're all caught up! 🎉</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — desktop only */}
          <aside className="hidden lg:block w-72 shrink-0 space-y-4 sticky top-8 self-start">
            {/* Profile mini card */}
            <div className="flex items-center gap-3 mb-2 px-1">
              <Link to={`/profile/${user?.username}`}>
                <div className="p-0.5 rounded-full bg-gradient-brand">
                  <div className="p-0.5 rounded-full bg-surface-0">
                    <Avatar user={user} size="md" />
                  </div>
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/profile/${user?.username}`} className="text-sm font-semibold text-zinc-200 hover:underline block truncate">
                  {user?.username}
                </Link>
                <p className="text-xs text-zinc-500 truncate">{user?.fullName || user?.email}</p>
              </div>
            </div>
            <SuggestedUsers />
          </aside>
        </div>
      </div>
    </div>
  )
}
