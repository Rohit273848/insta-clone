import api from './api'

export const userService = {
  async getProfile(username) {
    const { data } = await api.get(`/users/${username}`)
    return data
  },

  async followUser(username) {
    const { data } = await api.post(`/follow/${username}`)
    return data
  },

  async unfollowUser(username) {
    const { data } = await api.delete(`/unfollow/${username}`)
    return data
  },

  async getFollowers(username) {
    const { data } = await api.get(`/users/${username}/followers`)
    return data
  },

  async getFollowing(username) {
    const { data } = await api.get(`/users/${username}/following`)
    return data
  },

  async searchUsers(query) {
    const { data } = await api.get(`/users/search?q=${query}`)
    return data
  },

  async getSuggestedUsers() {
    const { data } = await api.get('/users/suggested')
    return data
  },
}
