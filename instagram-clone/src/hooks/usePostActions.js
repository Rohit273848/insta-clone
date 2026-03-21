import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { postService } from '../services/postService'
import { userService } from '../services/userService'

// Hook for post likes with optimistic updates
export function useLike(initialLiked, initialCount, postId) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  const [animate, setAnimate] = useState(false)

  const toggleLike = useCallback(async () => {
    if (loading) return

    // Optimistic update
    const prevLiked = liked
    const prevCount = count
    setLiked(!liked)
    setCount(liked ? count - 1 : count + 1)
    if (!liked) {
      setAnimate(true)
      setTimeout(() => setAnimate(false), 500)
    }

    setLoading(true)
    try {
      if (prevLiked) {
        await postService.unlikePost(postId)
      } else {
        await postService.likePost(postId)
      }
    } catch (err) {
      // Revert on error
      setLiked(prevLiked)
      setCount(prevCount)
      toast.error('Failed to update like')
    } finally {
      setLoading(false)
    }
  }, [liked, count, loading, postId])

  return { liked, count, loading, animate, toggleLike }
}

// Hook for follow/unfollow with optimistic updates
export function useFollow(initialFollowing, username) {
  const [following, setFollowing] = useState(initialFollowing)
  const [loading, setLoading] = useState(false)

  const toggleFollow = useCallback(async () => {
    if (loading) return

    const prev = following
    setFollowing(!following)
    setLoading(true)

    try {
      if (prev) {
        await userService.unfollowUser(username)
      } else {
        await userService.followUser(username)
      }
    } catch (err) {
      setFollowing(prev)
      toast.error('Failed to update follow')
    } finally {
      setLoading(false)
    }
  }, [following, loading, username])

  return { following, loading, toggleFollow }
}

// Hook for async operations with loading/error state
export function useAsync() {
  const [state, setState] = useState({
    loading: false,
    error: null,
    data: null,
  })

  const execute = useCallback(async (asyncFn) => {
    setState({ loading: true, error: null, data: null })
    try {
      const data = await asyncFn()
      setState({ loading: false, error: null, data })
      return data
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Something went wrong'
      setState({ loading: false, error: message, data: null })
      throw err
    }
  }, [])

  return { ...state, execute }
}
