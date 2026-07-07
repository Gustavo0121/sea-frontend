import { describe, expect, it } from 'vitest'
import { createFakeJwt } from '../test/fakeJwt'
import { decodeToken, isTokenExpired } from './jwt'

describe('decodeToken', () => {
  it('decodifica o payload de um JWT válido', () => {
    const token = createFakeJwt({ sub: '1', username: 'admin', role: 'ADMIN', exp: 9999999999 })
    expect(decodeToken(token)).toEqual({ sub: '1', username: 'admin', role: 'ADMIN', exp: 9999999999 })
  })

  it('decodifica payload com acentuação (UTF-8) corretamente', () => {
    const token = createFakeJwt({ name: 'José da Conceição' })
    expect(decodeToken(token)?.name).toBe('José da Conceição')
  })

  it('retorna null para token malformado', () => {
    expect(decodeToken('token-invalido')).toBeNull()
    expect(decodeToken('')).toBeNull()
  })
})

describe('isTokenExpired', () => {
  it('retorna false quando não há claim exp', () => {
    expect(isTokenExpired({})).toBe(false)
  })

  it('retorna true para token expirado', () => {
    expect(isTokenExpired({ exp: Math.floor(Date.now() / 1000) - 60 })).toBe(true)
  })

  it('retorna false para token ainda válido', () => {
    expect(isTokenExpired({ exp: Math.floor(Date.now() / 1000) + 60 })).toBe(false)
  })

  it('retorna false para decoded null', () => {
    expect(isTokenExpired(null)).toBe(false)
  })
})
