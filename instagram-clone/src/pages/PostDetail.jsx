import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Heart, Bookmark, Send, ArrowLeft, MoreHorizontal, Trash2 } from 'lucide-react'
import { postService } from '../services/postService'
import { useAuth } from '../context/AuthContext'
import { useLike, useFollow } from '../hooks/usePostActions'
import { Avatar } from '../components/Navbar'
import toast from 'react-hot-toast'

function TimeAgo({ date }) {
  const now = new Date()
  const past = new Date(date)
  const diff = (now - past) / 1000
  if (diff < 60) return <>{Math.floor(diff)} seconds ago</>
  if (diff < 3600) return <>{Math.floor(diff / 60)} minutes ago</>
  if (diff < 86400) return <>{Math.floor(diff / 3600)} hours ago</>
  if (diff < 604800) return <>{Math.floor(diff / 86400)} days ago</>
  return <>{past.toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}</>
}

function LikesList({ likes }) {
  if (!likes?.length) return null
  return (
    <div className="px-4 pb-2">
      <p className="text-sm font-semibold text-zinc-200">
        {likes.length.toLocaleString()} {likes.length === 1 ? 'like' : 'likes'}
      </p>
    </div>
  )
}

export default function PostDetail() {
  const { postId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      try {
        const data = await postService.getPostById(postId)
        setPost(data?.post || data)
      } catch {
        toast.error('Post not found')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [postId, navigate])

  const isOwner = user?._id === post?.user?._id || user?.username === post?.user?.username
  const isLikedByMe = post?.likes?.includes(user?._id) || post?.isLikedByMe || false

  const { liked, count: likeCount, animate, toggleLike } = useLike(
    isLikedByMe,
    post?.likes?.length ?? 0,
    postId
  )

  const { following, toggleFollow } = useFollow(
    post?.user?.isFollowedByMe || false,
    post?.user?.username
  )

  const handleDelete = async () => {
    try {
      await postService.deletePost(postId)
      toast.success('Post deleted')
      navigate('/')
    } catch {
      toast.error('Failed to delete')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-14 pb-20 lg:pt-0 lg:pb-0 lg:pl-64">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="card overflow-hidden animate-pulse">
            <div className="flex flex-col md:flex-row">
              <div className="aspect-square md:w-1/2 skeleton rounded-none" />
              <div className="md:w-1/2 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full skeleton" />
                  <div className="space-y-2">
                    <div className="h-3 w-28 skeleton rounded" />
                    <div className="h-2.5 w-20 skeleton rounded" />
                  </div>
                </div>
                <div className="space-y-2 pt-4">
                  <div className="h-3 w-full skeleton rounded" />
                  <div className="h-3 w-3/4 skeleton rounded" />
                  <div className="h-3 w-1/2 skeleton rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) return null

  return (
    <div className="min-h-screen pt-14 pb-20 lg:pt-0 lg:pb-0 lg:pl-64">
      <div className="max-w-4xl mx-auto px-4 py-6 lg:py-8">
        <button onClick={() => navigate(-1)} className="btn-ghost mb-6 -ml-2">
          <ArrowLeft size={18} /> Back
        </button>

        <div className="card overflow-hidden animate-fade-in">
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="md:w-[55%] bg-surface-1 relative">
              <div className="relative aspect-square md:aspect-auto md:h-full min-h-[300px]">
                {!imgLoaded && <div className="absolute inset-0 skeleton" />}
                <img
                  src={post.image}
                  alt={post.caption}
                  className={`w-full h-full object-contain transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImgLoaded(true)}
                  onDoubleClick={() => { if (!liked) toggleLike() }}
                />
              </div>
            </div>

            {/* Details panel */}
            <div className="md:w-[45%] flex flex-col">
              {/* Post author */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-surface-3">
                <Link to={`/profile/${post.user?.username}`} className="flex items-center gap-3 group">
                  <div className="p-0.5 rounded-full bg-gradient-brand">
                    <div className="p-0.5 rounded-full bg-surface-2">
                      <Avatar user={post.user} size="sm" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                      {post.user?.username}
                    </p>
                    {post.location && <p className="text-xs text-zinc-500">{post.location}</p>}
                  </div>
                </Link>
                <div className="flex items-center gap-2">
                  {!isOwner && (
                    <button
                      onClick={toggleFollow}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                        following
                          ? 'border-surface-5 text-zinc-400 hover:border-red-500 hover:text-red-400'
                          : 'border-brand-600 text-brand-400 hover:bg-brand-600 hover:text-white'
                      }`}
                    >
                      {following ? 'Following' : 'Follow'}
                    </button>
                  )}
                  <div className="relative">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="btn-ghost p-1.5">
                      <MoreHorizontal size={18} />
                    </button>
                    {menuOpen && (
                      <div className="absolute right-0 top-8 card border-surface-4 w-44 z-10 overflow-hidden animate-scale-in">
                        {isOwner && (
                          <button
                            onClick={handleDelete}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-surface-3 transition-colors"
                          >
                            <Trash2 size={14} /> Delete Post
                          </button>
                        )}
                        <button
                          onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied!'); setMenuOpen(false) }}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-zinc-300 hover:bg-surface-3 transition-colors"
                        >
                          Copy Link
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Caption + comments area */}
              <div className="flex-1 overflow-y-auto px-4 py-4 min-h-[120px] scrollbar-hide">
                {post.caption && (
                  <div className="flex gap-3 mb-4">
                    <Link to={`/profile/${post.user?.username}`} className="shrink-0">
                      <Avatar user={post.user} size="xs" />
                    </Link>
                    <div>
                      <p className="text-sm text-zinc-300">
                        <Link to={`/profile/${post.user?.username}`} className="font-semibold text-zinc-200 mr-2 hover:underline">
                          {post.user?.username}
                        </Link>
                        {post.caption}
                      </p>
                      <p className="text-xs text-zinc-600 mt-1">
                        <TimeAgo date={post.createdAt} />
                      </p>
                    </div>
                  </div>
                )}
                <div className="text-center py-4">
                  <p className="text-xs text-zinc-600">Comments coming soon</p>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-surface-3 px-4 py-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={toggleLike}
                      className={`p-2 -ml-2 rounded-lg transition-all hover:bg-surface-3 ${animate ? 'heart-beat' : ''}`}
                    >
                      <Heart
                        size={24}
                        className={`transition-colors ${liked ? 'fill-red-500 stroke-red-500' : 'stroke-zinc-400'}`}
                      />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-surface-3 transition-colors">
                      <Send size={24} className="stroke-zinc-400" />
                    </button>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-surface-3 transition-colors">
                    <Bookmark size={24} className="stroke-zinc-400" />
                  </button>
                </div>

                <LikesList likes={[...Array(likeCount)]} />

                <p className="text-xs text-zinc-600 pb-1">
                  <TimeAgo date={post.createdAt} />
                </p>
              </div>

              {/* Comment input */}
              <div className="border-t border-surface-3 px-4 py-3 flex items-center gap-3">
                <Avatar user={user} size="xs" />
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 bg-transparent text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none"
                />
                <button className="text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors">
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
