export interface Endereco {
  cep: string
  logradouro: string
  bairro: string
  cidade: string
  uf: string
  complemento: string | null
}

export type TipoTelefone = 'RESIDENCIAL' | 'COMERCIAL' | 'CELULAR'

export interface Telefone {
  tipo: TipoTelefone
  numero: string
}

export interface Email {
  endereco: string
}

export interface Cliente {
  id: number
  nome: string
  cpf: string
  endereco: Endereco
  telefones: Telefone[]
  emails: Email[]
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface ClienteRequestDTO {
  nome: string
  cpf: string
  endereco: Endereco
  telefones: Telefone[]
  emails: Email[]
}
