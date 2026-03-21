import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, X, Users, TrendingUp } from 'lucide-react'
import { userService } from '../services/userService'
import { postService } from '../services/postService'
import UserCard, { UserCardSkeleton } from '../components/UserCard'
import toast from 'react-hot-toast'

function ExploreGrid({ posts, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-0.5">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="aspect-square skeleton" />
        ))}
      </div>
    )
  }
  if (!posts.length) return null
  return (
    <div className="grid grid-cols-3 gap-0.5">
      {posts.map((post, i) => (
        <Link
          key={post._id}
          to={`/post/${post._id}`}
          className={`relative group block overflow-hidden bg-surface-2 ${
            i % 7 === 0 ? 'col-span-2 row-span-2' : ''
          }`}
          style={{ aspectRatio: i % 7 === 0 ? undefined : '1/1' }}
        >
          {i % 7 === 0 && <div style={{ paddingBottom: '100%' }} />}
          <div className={`${i % 7 === 0 ? 'absolute inset-0' : 'aspect-square'}`}>
            <img
              src={post.image}
              alt={post.caption}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
              <span className="text-white font-semibold text-sm flex items-center gap-1">
                ❤️ {post.likes?.length ?? post.likesCount ?? 0}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default function Explore() {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [suggested, setSuggested] = useState([])
  const [posts, setPosts] = useState([])
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [activeTab, setActiveTab] = useState('discover') // 'discover' | 'users'
  const searchTimeout = useRef(null)

  useEffect(() => {
    userService.getSuggestedUsers()
      .then((d) => setSuggested(d?.users || d || []))
      .catch(() => {})
      .finally(() => setLoadingUsers(false))

    postService.getAllPosts()
      .then((d) => setPosts(d?.posts || d || []))
      .catch(() => {})
      .finally(() => setLoadingPosts(false))
  }, [])

  const handleSearch = (val) => {
    setQuery(val)
    clearTimeout(searchTimeout.current)
    if (!val.trim()) { setSearchResults([]); return }
    setLoadingSearch(true)
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await userService.searchUsers(val)
        setSearchResults(res?.users || res || [])
      } catch {
        toast.error('Search failed')
      } finally {
        setLoadingSearch(false)
      }
    }, 400)
  }

  const isSearching = query.trim().length > 0
  const displayUsers = isSearching ? searchResults : suggested

  return (
    <div className="min-h-screen pt-14 pb-20 lg:pt-0 lg:pb-0 lg:pl-64">
      <div className="max-w-3xl mx-auto px-4 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-2xl text-white italic mb-4">Explore</h1>

          {/* Search bar */}
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search users..."
              className="input-field pl-11 pr-11"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setSearchResults([]) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-surface-2 rounded-xl mb-6">
          {[
            { id: 'discover', icon: TrendingUp, label: 'Discover' },
            { id: 'users', icon: Users, label: 'People' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === id
                  ? 'bg-surface-4 text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Discover tab */}
        {activeTab === 'discover' && (
          <div className="animate-fade-in">
            {isSearching ? (
              /* Search results shown as users */
              <div className="space-y-3">
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                  {loadingSearch ? 'Searching...' : `${searchResults.length} results for "${query}"`}
                </p>
                {loadingSearch
                  ? [...Array(4)].map((_, i) => <UserCardSkeleton key={i} />)
                  : searchResults.length === 0
                    ? <div className="card p-8 text-center text-zinc-500">No users found for "{query}"</div>
                    : searchResults.map((u) => <UserCard key={u._id} user={u} />)
                }
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={15} className="text-zinc-500" />
                  <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Recent Posts</span>
                </div>
                <ExploreGrid posts={posts} loading={loadingPosts} />
                {!loadingPosts && posts.length === 0 && (
                  <div className="card p-10 text-center">
                    <p className="text-zinc-500">No posts to explore yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Users tab */}
        {activeTab === 'users' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <Users size={15} className="text-zinc-500" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                {isSearching ? `Results for "${query}"` : 'Suggested for you'}
              </span>
            </div>
            {(loadingUsers && !isSearching) || (loadingSearch && isSearching)
              ? [...Array(5)].map((_, i) => <UserCardSkeleton key={i} />)
              : displayUsers.length === 0
                ? (
                  <div className="card p-10 text-center">
                    <p className="text-zinc-500">
                      {isSearching ? `No users found for "${query}"` : 'No suggestions yet'}
                    </p>
                  </div>
                )
                : displayUsers.map((u) => <UserCard key={u._id} user={u} />)
            }
          </div>
        )}
      </div>
    </div>
  )
}
