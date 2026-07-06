import { api } from './api'
import type { Cliente, Page } from '../types/cliente'

export interface ListarClientesParams {
  nome?: string
  cpf?: string
  page?: number
  size?: number
  sort?: string
}

export const clienteService = {
  async listar(params: ListarClientesParams = {}): Promise<Page<Cliente>> {
    const { data } = await api.get<Page<Cliente>>('/clientes', { params })
    return data
  },
}
