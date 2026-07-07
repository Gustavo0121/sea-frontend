import { describe, expect, it } from 'vitest'
import { clienteFormSchema } from './clienteFormSchema'

const validPayload = {
  nome: 'João da Silva',
  cpf: '111.444.777-35',
  endereco: {
    cep: '01310-100',
    logradouro: 'Av. Paulista',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    uf: 'SP',
    complemento: '',
  },
  telefones: [{ tipo: 'CELULAR', numero: '(11) 98888-7777' }],
  emails: [{ endereco: 'joao@example.com' }],
}

describe('clienteFormSchema', () => {
  it('aceita um payload válido', () => {
    expect(clienteFormSchema.safeParse(validPayload).success).toBe(true)
  })

  it('rejeita nome com menos de 3 caracteres', () => {
    const result = clienteFormSchema.safeParse({ ...validPayload, nome: 'Jo' })
    expect(result.success).toBe(false)
  })

  it('rejeita nome com caracteres inválidos', () => {
    const result = clienteFormSchema.safeParse({ ...validPayload, nome: 'João<script>' })
    expect(result.success).toBe(false)
  })

  it('rejeita CPF inválido', () => {
    const result = clienteFormSchema.safeParse({ ...validPayload, cpf: '111.444.777-36' })
    expect(result.success).toBe(false)
  })

  it('rejeita CEP com menos de 8 dígitos', () => {
    const result = clienteFormSchema.safeParse({
      ...validPayload,
      endereco: { ...validPayload.endereco, cep: '1234' },
    })
    expect(result.success).toBe(false)
  })

  it('rejeita UF que não tenha exatamente 2 letras', () => {
    const result = clienteFormSchema.safeParse({
      ...validPayload,
      endereco: { ...validPayload.endereco, uf: 'SPX' },
    })
    expect(result.success).toBe(false)
  })

  it('rejeita celular com menos de 11 dígitos', () => {
    const result = clienteFormSchema.safeParse({
      ...validPayload,
      telefones: [{ tipo: 'CELULAR', numero: '(11) 8888-7777' }],
    })
    expect(result.success).toBe(false)
  })

  it('aceita telefone fixo com 10 dígitos', () => {
    const result = clienteFormSchema.safeParse({
      ...validPayload,
      telefones: [{ tipo: 'RESIDENCIAL', numero: '(11) 3333-4444' }],
    })
    expect(result.success).toBe(true)
  })

  it('rejeita email com formato inválido', () => {
    const result = clienteFormSchema.safeParse({
      ...validPayload,
      emails: [{ endereco: 'nao-e-um-email' }],
    })
    expect(result.success).toBe(false)
  })

  it('exige ao menos um telefone e um email', () => {
    expect(clienteFormSchema.safeParse({ ...validPayload, telefones: [] }).success).toBe(false)
    expect(clienteFormSchema.safeParse({ ...validPayload, emails: [] }).success).toBe(false)
  })
})
