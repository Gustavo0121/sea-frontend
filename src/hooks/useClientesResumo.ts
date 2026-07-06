import { useQuery } from '@tanstack/react-query'
import { clienteService } from '../services/clienteService'

const RECENTES_SIZE = 5

export function useClientesResumo() {
  return useQuery({
    queryKey: ['clientes', 'resumo'],
    queryFn: () => clienteService.listar({ page: 0, size: RECENTES_SIZE, sort: 'id,desc' }),
  })
}
