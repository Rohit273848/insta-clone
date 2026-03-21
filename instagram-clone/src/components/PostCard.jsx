import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Heart, MessageCircle, Bookmark, MoreHorizontal,
  Send, Trash2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLike, useFollow } from '../hooks/usePostActions'
import { postService } from '../services/postService'
import { Avatar } from './Navbar'
import toast from 'react-hot-toast'

function TimeAgo({ date }) {
  const now = new Date()
  const past = new Date(date)
  const diff = (now - past) / 1000
  if (diff < 60) return <span>{Math.floor(diff)}s</span>
  if (diff < 3600) return <span>{Math.floor(diff / 60)}m</span>
  if (diff < 86400) return <span>{Math.floor(diff / 3600)}h</span>
  if (diff < 604800) return <span>{Math.floor(diff / 86400)}d</span>
  return <span>{past.toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
}

export default function PostCard({ post, onDelete, compact = false }) {
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [captionExpanded, setCaptionExpanded] = useState(false)

  const isOwner = user?._id === post?.user?._id || user?.username === post?.user?.username

  // Use like hook with optimistic update
  const isLikedByMe = post?.likes?.includes(user?._id) || post?.isLikedByMe || false
  const { liked, count: likeCount, animate, toggleLike } = useLike(
    isLikedByMe,
    post?.likes?.length ?? post?.likesCount ?? 0,
    post?._id
  )

  // Follow hook
  const isFollowedByMe = post?.user?.isFollowedByMe || false
  const { following, toggleFollow } = useFollow(isFollowedByMe, post?.user?.username)

  const handleDelete = async () => {
    try {
      await postService.deletePost(post._id)
      toast.success('Post deleted')
      onDelete?.(post._id)
    } catch {
      toast.error('Failed to delete post')
    }
    setMenuOpen(false)
  }

  const handleDoubleTap = () => {
    if (!liked) toggleLike()
  }

  const caption = post?.caption || ''
  const isLongCaption = caption.length > 120

  return (
    <article className={`card animate-slide-up ${compact ? '' : 'card-hover'}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post?.user?.username}`}>
            <div className="p-0.5 rounded-full bg-gradient-brand">
              <div className="p-0.5 rounded-full bg-surface-2">
                <Avatar user={post?.user} size="sm" />
              </div>
            </div>
          </Link>
          <div>
            <Link
              to={`/profile/${post?.user?.username}`}
              className="text-sm font-semibold text-zinc-200 hover:text-white transition-colors"
            >
              {post?.user?.username}
            </Link>
            {post?.location && (
              <p className="text-xs text-zinc-500">{post.location}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isOwner && (
            <button
              onClick={toggleFollow}
              className={`text-xs font-semibold px-3 py-1 rounded-full border transition-all duration-200 ${
                following
                  ? 'border-surface-5 text-zinc-400 hover:border-red-500 hover:text-red-400'
                  : 'border-brand-600 text-brand-400 hover:bg-brand-600 hover:text-white'
              }`}
            >
              {following ? 'Following' : 'Follow'}
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="btn-ghost p-1.5 rounded-lg"
            >
              <MoreHorizontal size={18} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 card border-surface-4 w-44 z-10 overflow-hidden animate-scale-in">
                <Link
                  to={`/post/${post._id}`}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-zinc-300 hover:bg-surface-3 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  View Post
                </Link>
                <Link
                  to={`/profile/${post?.user?.username}`}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-zinc-300 hover:bg-surface-3 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  View Profile
                </Link>
                {isOwner && (
                  <>
                    <div className="divider" />
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-surface-3 transition-colors"
                    >
                      <Trash2 size={14} /> Delete Post
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image */}
      <div
        className="relative bg-surface-1 aspect-square overflow-hidden cursor-pointer"
        onDoubleClick={handleDoubleTap}
      >
        {!imgLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}
        {post?.image && (
          <img
            src={post.image}
            alt={post.caption || 'Post'}
            className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
          />
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <button
              onClick={toggleLike}
              className={`p-2 -ml-2 rounded-lg transition-all duration-200 hover:bg-surface-3 ${
                animate ? 'heart-beat' : ''
              }`}
            >
              <Heart
                size={22}
                className={`transition-colors duration-200 ${
                  liked ? 'fill-red-500 stroke-red-500' : 'stroke-zinc-400'
                }`}
              />
            </button>
            <Link to={`/post/${post?._id}`} className="p-2 rounded-lg hover:bg-surface-3 transition-colors">
              <MessageCircle size={22} className="stroke-zinc-400" />
            </Link>
            <button className="p-2 rounded-lg hover:bg-surface-3 transition-colors">
              <Send size={22} className="stroke-zinc-400" />
            </button>
          </div>
          <button className="p-2 rounded-lg hover:bg-surface-3 transition-colors">
            <Bookmark size={22} className="stroke-zinc-400" />
          </button>
        </div>

        {/* Like count */}
        {likeCount > 0 && (
          <p className="text-sm font-semibold text-zinc-200 mb-1">
            {likeCount.toLocaleString()} {likeCount === 1 ? 'like' : 'likes'}
          </p>
        )}

        {/* Caption */}
        {caption && (
          <p className="text-sm text-zinc-300 leading-relaxed">
            <Link to={`/profile/${post?.user?.username}`} className="font-semibold text-zinc-200 mr-2 hover:text-white">
              {post?.user?.username}
            </Link>
            {isLongCaption && !captionExpanded
              ? <>{caption.slice(0, 120)}... <button onClick={() => setCaptionExpanded(true)} className="text-zinc-500 hover:text-zinc-300 text-xs">more</button></>
              : caption
            }
          </p>
        )}

        {/* Timestamp */}
        <p className="text-xs text-zinc-600 mt-2">
          <TimeAgo date={post?.createdAt} /> ago
        </p>
      </div>
    </article>
  )
}

// Skeleton loader
export function PostCardSkeleton() {
  return (
    <div className="card">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-8 h-8 rounded-full skeleton" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-24 skeleton rounded" />
          <div className="h-2.5 w-16 skeleton rounded" />
        </div>
      </div>
      <div className="aspect-square skeleton rounded-none" />
      <div className="px-4 py-3 space-y-2">
        <div className="h-3 w-16 skeleton rounded" />
        <div className="h-3 w-full skeleton rounded" />
        <div className="h-3 w-3/4 skeleton rounded" />
      </div>
    </div>
  )
}
