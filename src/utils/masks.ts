import type { TipoTelefone } from '../types/cliente'

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function maskCpf(value: string): string {
  return onlyDigits(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function maskCep(value: string): string {
  return onlyDigits(value)
    .slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, '$1-$2')
}

export function maskTelefone(value: string, tipo: TipoTelefone): string {
  const maxLength = tipo === 'CELULAR' ? 11 : 10
  const separatorIndex = tipo === 'CELULAR' ? 7 : 6
  const digits = onlyDigits(value).slice(0, maxLength)

  if (digits.length <= 2) return digits ? `(${digits}` : ''
  if (digits.length <= separatorIndex) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, separatorIndex)}-${digits.slice(separatorIndex)}`
}
