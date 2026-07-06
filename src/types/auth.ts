export interface LoginCredentials {
  login: string
  senha: string
}

export interface AuthResponse {
  token: string
  tipo: string
  expiraEmSegundos: number
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
