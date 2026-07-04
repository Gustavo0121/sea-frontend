import axios from 'axios'
import { tokenStorage } from '../utils/tokenStorage'

export const UNAUTHORIZED_EVENT = 'sea:unauthorized'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.clear()
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }
    return Promise.reject(error)
  },
)
