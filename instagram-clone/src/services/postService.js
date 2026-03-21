import api from './api'

export const postService = {
  async getAllPosts() {
    const { data } = await api.get('/posts')
    return data
  },

  async getPostById(postId) {
    const { data } = await api.get(`/posts/details/${postId}`)
    return data
  },

  async createPost({ image, caption }) {
    const formData = new FormData()
    formData.append('image', image)
    formData.append('caption', caption)
    const { data } = await api.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
  },

  async getUserPosts(username) {
    const { data } = await api.get(`/posts/user/${username}`)
    return data
  },

  async likePost(postId) {
    const { data } = await api.post(`/like/${postId}`)
    return data
  },

  async unlikePost(postId) {
    const { data } = await api.delete(`/unlike/${postId}`)
    return data
  },

  async deletePost(postId) {
    const { data } = await api.delete(`/posts/${postId}`)
    return data
  },
}
