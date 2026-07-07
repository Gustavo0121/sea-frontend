import type { DecodedToken } from '../types/auth'

function base64UrlEncode(json: string): string {
  const utf8Binary = unescape(encodeURIComponent(json))
  return btoa(utf8Binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Monta um JWT com payload arbitrário (sem assinatura real) para uso em testes. */
export function createFakeJwt(payload: Partial<DecodedToken>): string {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = base64UrlEncode(JSON.stringify(payload))
  return `${header}.${body}.fake-signature`
}
