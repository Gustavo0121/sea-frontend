export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
}

export interface DecodedToken {
  sub?: string
  username?: string
  name?: string
  roles?: string[]
  exp?: number
  iat?: number
  [claim: string]: unknown
}
