import { describe, expect, it } from 'vitest'
import { maskCep, maskCpf, maskTelefone, onlyDigits } from './masks'

describe('onlyDigits', () => {
  it('remove tudo que não for dígito', () => {
    expect(onlyDigits('100.***.***-08')).toBe('10008')
    expect(onlyDigits('(11) 98888-7777')).toBe('11988887777')
  })
})

describe('maskCpf', () => {
  it('formata progressivamente conforme os dígitos são digitados', () => {
    expect(maskCpf('1')).toBe('1')
    expect(maskCpf('100')).toBe('100')
    expect(maskCpf('10012345678')).toBe('100.123.456-78')
  })

  it('ignora caracteres não numéricos e trunca em 11 dígitos', () => {
    expect(maskCpf('100.123.456-789999')).toBe('100.123.456-78')
  })
})

describe('maskCep', () => {
  it('formata como 00000-000', () => {
    expect(maskCep('01310100')).toBe('01310-100')
  })

  it('trunca em 8 dígitos', () => {
    expect(maskCep('013101009999')).toBe('01310-100')
  })
})

describe('maskTelefone', () => {
  it('formata celular com 9 dígitos após o DDD', () => {
    expect(maskTelefone('11988887777', 'CELULAR')).toBe('(11) 98888-7777')
  })

  it('formata fixo com 8 dígitos após o DDD', () => {
    expect(maskTelefone('1133334444', 'RESIDENCIAL')).toBe('(11) 3333-4444')
  })

  it('lida com entrada parcial sem lançar erro', () => {
    expect(maskTelefone('1', 'CELULAR')).toBe('(1')
    expect(maskTelefone('', 'CELULAR')).toBe('')
    expect(maskTelefone('119', 'CELULAR')).toBe('(11) 9')
  })

  it('trunca conforme o tipo (10 dígitos para fixo, 11 para celular)', () => {
    expect(maskTelefone('113333444455', 'RESIDENCIAL')).toBe('(11) 3333-4444')
    expect(maskTelefone('119888877776666', 'CELULAR')).toBe('(11) 98888-7777')
  })
})
