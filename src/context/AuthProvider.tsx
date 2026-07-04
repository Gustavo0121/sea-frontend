import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AuthContext } from './authContext'
import { authService } from '../services/authService'
import { UNAUTHORIZED_EVENT } from '../services/api'
import { tokenStorage } from '../utils/tokenStorage'
import { decodeToken, isTokenExpired } from '../utils/jwt'
import type { DecodedToken, LoginCredentials } from '../types/auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DecodedToken | null>(() => {
    const token = tokenStorage.get()
    const decoded = token ? decodeToken(token) : null
    return decoded && !isTokenExpired(decoded) ? decoded : null
  })

  const logoutTimerRef = useRef<number | undefined>(undefined)

  const logout = useCallback(() => {
    window.clearTimeout(logoutTimerRef.current)
    tokenStorage.clear()
    setUser(null)
  }, [])

  const scheduleAutoLogout = useCallback(
    (decoded: DecodedToken | null) => {
      window.clearTimeout(logoutTimerRef.current)
      if (!decoded?.exp) return

      const msUntilExpiry = decoded.exp * 1000 - Date.now()
      if (msUntilExpiry <= 0) return
      logoutTimerRef.current = window.setTimeout(logout, msUntilExpiry)
    },
    [logout],
  )

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const { token } = await authService.login(credentials)
      const decoded = decodeToken(token)
      tokenStorage.set(token)
      setUser(decoded)
      scheduleAutoLogout(decoded)
    },
    [scheduleAutoLogout],
  )

  useEffect(() => {
    const token = tokenStorage.get()
    const decoded = token ? decodeToken(token) : null
    if (decoded && isTokenExpired(decoded)) {
      tokenStorage.clear()
    } else if (decoded) {
      scheduleAutoLogout(decoded)
    }

    window.addEventListener(UNAUTHORIZED_EVENT, logout)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, logout)
  }, [logout, scheduleAutoLogout])

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, logout }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
