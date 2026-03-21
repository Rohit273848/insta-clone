import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Grid, Bookmark, Tag, Settings, UserPlus, UserCheck,
  Camera, MapPin, Link as LinkIcon, Calendar, ArrowLeft
} from 'lucide-react'
import { userService } from '../services/userService'
import { postService } from '../services/postService'
import { useAuth } from '../context/AuthContext'
import { useFollow } from '../hooks/usePostActions'
import { Avatar } from '../components/Navbar'
import toast from 'react-hot-toast'

function StatBox({ label, value }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-xl font-bold text-white font-display">{(value ?? 0).toLocaleString()}</span>
      <span className="text-xs text-zinc-500">{label}</span>
    </div>
  )
}

function PostGrid({ posts, loading }) {
  if (loading) {
    return (
      <div className="post-grid">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="aspect-square skeleton" />
        ))}
      </div>
    )
  }
  if (posts.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="w-16 h-16 rounded-full border-2 border-zinc-700 mx-auto flex items-center justify-center mb-4">
          <Camera size={24} className="text-zinc-600" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-400 mb-1">No Posts Yet</h3>
        <p className="text-sm text-zinc-600">Posts will appear here</p>
      </div>
    )
  }
  return (
    <div className="post-grid">
      {posts.map((post) => (
        <Link key={post._id} to={`/post/${post._id}`} className="relative group block aspect-square overflow-hidden bg-surface-2">
          <img
            src={post.image}
            alt={post.caption}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="text-white text-sm font-semibold flex items-center gap-1.5">
              ❤️ {post.likes?.length ?? post.likesCount ?? 0}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

function FollowersModal({ username, type, onClose }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fn = type === 'followers' ? userService.getFollowers : userService.getFollowing
    fn(username)
      .then((data) => setUsers(data?.users || data || []))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }, [username, type])

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="card w-full max-w-sm max-h-[80vh] flex flex-col animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-surface-3">
          <h3 className="font-semibold text-zinc-200 capitalize">{type}</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200">✕</button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full skeleton" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-24 skeleton rounded" />
                    <div className="h-2.5 w-16 skeleton rounded" />
                  </div>
                </div>
              ))
            : users.map((u) => (
                <div key={u._id} className="flex items-center gap-3 py-1">
                  <Link to={`/profile/${u.username}`} onClick={onClose}>
                    <Avatar user={u} size="sm" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/profile/${u.username}`} onClick={onClose} className="text-sm font-medium text-zinc-200 hover:underline block truncate">
                      {u.username}
                    </Link>
                    {u.fullName && <p className="text-xs text-zinc-500 truncate">{u.fullName}</p>}
                  </div>
                </div>
              ))}
          {!loading && users.length === 0 && (
            <p className="text-center text-zinc-500 py-8 text-sm">No {type} yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Profile() {
  const { username } = useParams()
  const { user: currentUser } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [activeTab, setActiveTab] = useState('posts')
  const [modal, setModal] = useState(null) // 'followers' | 'following' | null
  const [followerCount, setFollowerCount] = useState(0)

  const isMe = currentUser?.username === username

  const { following, loading: followLoading, toggleFollow } = useFollow(
    profile?.isFollowedByMe || false,
    username
  )

  const fetchProfile = useCallback(async () => {
    setLoadingProfile(true)
    try {
      const data = await userService.getProfile(username)
      const p = data?.user || data
      setProfile(p)
      setFollowerCount(p?.followersCount ?? p?.followers?.length ?? 0)
    } catch (err) {
      toast.error('User not found')
      navigate('/')
    } finally {
      setLoadingProfile(false)
    }
  }, [username, navigate])

  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true)
    try {
      const data = await postService.getUserPosts(username)
      setPosts(data?.posts || data || [])
    } catch {
      setPosts([])
    } finally {
      setLoadingPosts(false)
    }
  }, [username])

  useEffect(() => {
    fetchProfile()
    fetchPosts()
  }, [username])

  const handleFollowToggle = async () => {
    const wasFollowing = following
    await toggleFollow()
    setFollowerCount((c) => wasFollowing ? c - 1 : c + 1)
  }

  const tabs = [
    { id: 'posts', icon: Grid, label: 'Posts' },
    { id: 'saved', icon: Bookmark, label: 'Saved' },
    { id: 'tagged', icon: Tag, label: 'Tagged' },
  ]

  if (loadingProfile) {
    return (
      <div className="min-h-screen pt-14 pb-20 lg:pt-0 lg:pb-0 lg:pl-64">
        <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
          <div className="flex flex-col sm:flex-row gap-8 items-start mb-8">
            <div className="w-28 h-28 rounded-full skeleton" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-40 skeleton rounded" />
              <div className="h-4 w-32 skeleton rounded" />
              <div className="h-4 w-full skeleton rounded" />
            </div>
          </div>
          <div className="post-grid">
            {[...Array(9)].map((_, i) => <div key={i} className="aspect-square skeleton" />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-14 pb-20 lg:pt-0 lg:pb-0 lg:pl-64">
      <div className="max-w-3xl mx-auto px-4 py-6 lg:py-8">
        {/* Back button on mobile */}
        <button onClick={() => navigate(-1)} className="lg:hidden btn-ghost mb-4 -ml-2">
          <ArrowLeft size={18} /> Back
        </button>

        {/* Profile header */}
        <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start mb-8 animate-fade-in">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="p-1 rounded-full bg-gradient-brand">
              <div className="p-1 rounded-full bg-surface-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28">
                  <Avatar user={profile} size="lg" />
                </div>
              </div>
            </div>
            {isMe && (
              <button className="absolute bottom-1 right-1 w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center border-2 border-surface-0 hover:bg-brand-500 transition-colors">
                <Camera size={12} className="text-white" />
              </button>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
              <h1 className="text-xl font-semibold text-white">{profile?.username}</h1>
              {isMe ? (
                <div className="flex gap-2 justify-center sm:justify-start">
                  <button className="btn-secondary text-xs py-1.5 px-4 flex items-center gap-1.5">
                    <Settings size={13} /> Edit Profile
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 justify-center sm:justify-start">
                  <button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={following ? 'btn-secondary py-1.5 px-4 text-xs' : 'btn-primary py-1.5 px-4 text-xs'}
                  >
                    {followLoading ? (
                      <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                    ) : following ? (
                      <><UserCheck size={13} /> Following</>
                    ) : (
                      <><UserPlus size={13} /> Follow</>
                    )}
                  </button>
                  <button className="btn-secondary text-xs py-1.5 px-4">Message</button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-8 justify-center sm:justify-start mb-4">
              <StatBox label="posts" value={posts.length} />
              <button onClick={() => setModal('followers')} className="hover:opacity-80 transition-opacity">
                <StatBox label="followers" value={followerCount} />
              </button>
              <button onClick={() => setModal('following')} className="hover:opacity-80 transition-opacity">
                <StatBox label="following" value={profile?.followingCount ?? profile?.following?.length ?? 0} />
              </button>
            </div>

            {/* Bio */}
            <div className="space-y-1">
              {profile?.fullName && (
                <p className="font-semibold text-sm text-zinc-200">{profile.fullName}</p>
              )}
              {profile?.bio && (
                <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">{profile.bio}</p>
              )}
              {profile?.location && (
                <p className="text-sm text-zinc-500 flex items-center gap-1.5 justify-center sm:justify-start">
                  <MapPin size={12} /> {profile.location}
                </p>
              )}
              {profile?.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-brand-400 hover:underline flex items-center gap-1.5 justify-center sm:justify-start"
                >
                  <LinkIcon size={12} /> {profile.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              {profile?.createdAt && (
                <p className="text-xs text-zinc-600 flex items-center gap-1.5 justify-center sm:justify-start">
                  <Calendar size={11} /> Joined {new Date(profile.createdAt).toLocaleDateString('en', { month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-surface-3 mb-1">
          <div className="flex">
            {tabs.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-widest transition-all border-t-2 -mt-px ${
                  activeTab === id
                    ? 'border-white text-white'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Posts grid */}
        {activeTab === 'posts' && <PostGrid posts={posts} loading={loadingPosts} />}
        {activeTab === 'saved' && (
          <div className="text-center py-16 text-zinc-500 text-sm">
            {isMe ? 'Saved posts will appear here' : 'Private'}
          </div>
        )}
        {activeTab === 'tagged' && (
          <div className="text-center py-16 text-zinc-500 text-sm">
            Tagged posts will appear here
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <FollowersModal username={username} type={modal} onClose={() => setModal(null)} />
      )}
    </div>
  )
}
