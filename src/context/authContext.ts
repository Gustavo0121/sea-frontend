import { createContext } from 'react'
import type { DecodedToken, LoginCredentials } from '../types/auth'

export interface AuthContextValue {
  user: DecodedToken | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
