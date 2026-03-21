import api from './api'

export const authService = {
  async register({ username, email, password, fullName }) {
    const { data } = await api.post('/auth/register', { username, email, password, fullName })
    return data
  },

  async login({ email, password }) {
    const { data } = await api.post('/auth/login', { email, password })
    return data
  },

  async getMe() {
    const { data } = await api.get('/auth/me')
    return data
  },
}
