import { api } from './api'
import type { AuthResponse, LoginCredentials } from '../types/auth'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials)
    return data
  },
}
