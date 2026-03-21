import React from 'react'
import { Link } from 'react-router-dom'
import { useFollow } from '../hooks/usePostActions'
import { useAuth } from '../context/AuthContext'
import { Avatar } from './Navbar'

export default function UserCard({ user, showFollowBtn = true, compact = false }) {
  const { user: currentUser } = useAuth()
  const isMe = currentUser?._id === user?._id || currentUser?.username === user?.username
  const { following, loading, toggleFollow } = useFollow(user?.isFollowedByMe || false, user?.username)

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-3 py-2">
        <Link to={`/profile/${user?.username}`} className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar user={user} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-200 truncate">{user?.username}</p>
            {user?.fullName && <p className="text-xs text-zinc-500 truncate">{user.fullName}</p>}
          </div>
        </Link>
        {showFollowBtn && !isMe && (
          <button
            onClick={toggleFollow}
            disabled={loading}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-200 shrink-0 ${
              following
                ? 'border-surface-5 text-zinc-400 hover:border-red-500 hover:text-red-400'
                : 'border-brand-600 text-brand-400 hover:bg-brand-600 hover:text-white'
            }`}
          >
            {following ? 'Following' : 'Follow'}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="card p-4 hover:border-surface-4 transition-colors animate-fade-in">
      <div className="flex items-start gap-3">
        <Link to={`/profile/${user?.username}`}>
          <div className="p-0.5 rounded-full bg-gradient-brand">
            <div className="p-0.5 rounded-full bg-surface-2">
              <Avatar user={user} size="md" />
            </div>
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <Link to={`/profile/${user?.username}`} className="hover:underline">
              <p className="font-semibold text-zinc-200 text-sm">{user?.username}</p>
            </Link>
            {showFollowBtn && !isMe && (
              <button
                onClick={toggleFollow}
                disabled={loading}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-200 shrink-0 ${
                  following
                    ? 'border-surface-5 text-zinc-400 hover:border-red-500 hover:text-red-400'
                    : 'border-brand-600 text-brand-400 hover:bg-brand-600 hover:text-white'
                }`}
              >
                {loading ? '...' : following ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
          {user?.fullName && <p className="text-xs text-zinc-500 mt-0.5">{user.fullName}</p>}
          {user?.bio && <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{user.bio}</p>}
          <div className="flex gap-4 mt-2">
            {user?.postsCount !== undefined && (
              <span className="text-xs text-zinc-500">
                <span className="font-semibold text-zinc-300">{user.postsCount}</span> posts
              </span>
            )}
            {user?.followersCount !== undefined && (
              <span className="text-xs text-zinc-500">
                <span className="font-semibold text-zinc-300">{user.followersCount}</span> followers
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Skeleton
export function UserCardSkeleton() {
  return (
    <div className="card p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full skeleton" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-28 skeleton rounded" />
          <div className="h-2.5 w-20 skeleton rounded" />
        </div>
      </div>
    </div>
  )
}
