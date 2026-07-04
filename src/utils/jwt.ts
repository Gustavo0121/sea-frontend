import type { DecodedToken } from '../types/auth'

function base64UrlDecode(segment: string): string {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  return atob(padded)
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null

    const decoded = base64UrlDecode(payload)
    const utf8Json = decodeURIComponent(
      Array.from(decoded)
        .map((char) => '%' + char.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    )
    return JSON.parse(utf8Json)
  } catch {
    return null
  }
}

export function isTokenExpired(decoded: DecodedToken | null): boolean {
  if (!decoded?.exp) return false
  return decoded.exp * 1000 <= Date.now()
}
