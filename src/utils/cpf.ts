import { onlyDigits } from './masks'

function calcularDigitoVerificador(base: string): number {
  let soma = 0
  let peso = base.length + 1
  for (const digito of base) {
    soma += Number(digito) * peso
    peso--
  }
  const resto = soma % 11
  return resto < 2 ? 0 : 11 - resto
}

/** Replica o algoritmo de validação de CPF do backend (CpfChecksum). */
export function isValidCpf(value: string): boolean {
  const digits = onlyDigits(value)
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false

  const base = digits.slice(0, 9)
  const d1 = calcularDigitoVerificador(base)
  const d2 = calcularDigitoVerificador(base + d1)
  return digits === `${base}${d1}${d2}`
}
