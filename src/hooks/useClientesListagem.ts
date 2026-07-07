import { useQuery } from '@tanstack/react-query'
import { clienteService } from '../services/clienteService'

const PAGE_SIZE = 10

interface UseClientesListagemParams {
  nome: string
  cpf: string
  page: number
}

export function useClientesListagem({ nome, cpf, page }: UseClientesListagemParams) {
  return useQuery({
    queryKey: ['clientes', 'listagem', { nome, cpf, page }],
    queryFn: () => clienteService.listar({ nome, cpf, page, size: PAGE_SIZE, sort: 'nome' }),
  })
}
