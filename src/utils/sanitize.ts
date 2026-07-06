/** Remove caracteres de risco de XSS e normaliza espaços antes do envio ao backend. */
export function sanitizeText(value: string): string {
  return value
    .replace(/[<>]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
}
