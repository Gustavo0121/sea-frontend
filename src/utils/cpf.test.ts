import { describe, expect, it } from 'vitest'
import { isValidCpf } from './cpf'

describe('isValidCpf', () => {
  it('aceita CPFs válidos, com ou sem máscara', () => {
    expect(isValidCpf('111.444.777-35')).toBe(true)
    expect(isValidCpf('11144477735')).toBe(true)
  })

  it('rejeita dígito verificador incorreto', () => {
    expect(isValidCpf('111.444.777-36')).toBe(false)
  })

  it('rejeita sequências de dígitos repetidos', () => {
    expect(isValidCpf('111.111.111-11')).toBe(false)
    expect(isValidCpf('00000000000')).toBe(false)
  })

  it('rejeita valores com tamanho diferente de 11 dígitos', () => {
    expect(isValidCpf('123')).toBe(false)
    expect(isValidCpf('')).toBe(false)
  })
})
