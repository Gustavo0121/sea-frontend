import { api } from './api'
import type { Cliente, ClienteRequestDTO, Page } from '../types/cliente'

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

  async buscarPorId(id: number): Promise<Cliente> {
    const { data } = await api.get<Cliente>(`/clientes/${id}`)
    return data
  },

  async cadastrar(dto: ClienteRequestDTO): Promise<Cliente> {
    const { data } = await api.post<Cliente>('/clientes', dto)
    return data
  },

  async atualizar(id: number, dto: ClienteRequestDTO): Promise<Cliente> {
    const { data } = await api.put<Cliente>(`/clientes/${id}`, dto)
    return data
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/clientes/${id}`)
  },
}
