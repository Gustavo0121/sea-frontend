import { describe, expect, it } from 'vitest'
import { sanitizeText } from './sanitize'

describe('sanitizeText', () => {
  it('remove os caracteres < e >', () => {
    expect(sanitizeText('<script>alert(1)</script>')).toBe('scriptalert(1)/script')
  })

  it('remove espaços nas bordas e colapsa espaços internos repetidos', () => {
    expect(sanitizeText('  João   da   Silva  ')).toBe('João da Silva')
  })

  it('preserva texto já limpo', () => {
    expect(sanitizeText('Rua das Flores, 123')).toBe('Rua das Flores, 123')
  })
})
