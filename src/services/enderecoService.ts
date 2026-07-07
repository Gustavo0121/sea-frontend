import { api } from './api'
import type { Endereco } from '../types/cliente'

export const enderecoService = {
  async buscarPorCep(cep: string): Promise<Endereco> {
    const { data } = await api.get<Endereco>(`/enderecos/${cep}`)
    return data
  },
}
