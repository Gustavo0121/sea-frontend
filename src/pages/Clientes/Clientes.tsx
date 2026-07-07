import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import styled from 'styled-components'
import { Button } from '../../components/Button'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { Input } from '../../components/Input'
import { Pagination } from '../../components/Pagination'
import { Table, type TableColumn } from '../../components/Table'
import { useAuth } from '../../hooks/useAuth'
import { useClientesListagem } from '../../hooks/useClientesListagem'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { useToast } from '../../hooks/useToast'
import { clienteService } from '../../services/clienteService'
import type { Cliente } from '../../types/cliente'

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
`

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  > * {
    min-width: 220px;
  }
`

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`

export function Clientes() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()
  const isAdmin = user?.role === 'ADMIN'

  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [page, setPage] = useState(0)
  const [clienteParaExcluir, setClienteParaExcluir] = useState<Cliente | null>(null)

  const debouncedNome = useDebouncedValue(nome)
  const debouncedCpf = useDebouncedValue(cpf)

  const [filtrosAplicados, setFiltrosAplicados] = useState({ nome: debouncedNome, cpf: debouncedCpf })
  if (filtrosAplicados.nome !== debouncedNome || filtrosAplicados.cpf !== debouncedCpf) {
    setFiltrosAplicados({ nome: debouncedNome, cpf: debouncedCpf })
    setPage(0)
  }

  const { data, isLoading, isError } = useClientesListagem({
    nome: debouncedNome,
    cpf: debouncedCpf,
    page,
  })

  const queryClient = useQueryClient()
  const excluirMutation = useMutation({
    mutationFn: (id: number) => clienteService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
      showToast('Cliente excluído com sucesso.', 'success')
      setClienteParaExcluir(null)
    },
    onError: () => {
      showToast('Não foi possível excluir o cliente.', 'error')
    },
  })

  const columns: TableColumn<Cliente>[] = [
    { key: 'nome', header: 'Nome', render: (row) => row.nome },
    { key: 'cpf', header: 'CPF', render: (row) => row.cpf },
    {
      key: 'acoes',
      header: 'Ações',
      render: (row) => (
        <Actions>
          <Button type="button" $variant="secondary" onClick={() => navigate(`/clientes/${row.id}`)}>
            Ver
          </Button>
          {isAdmin && (
            <>
              <Button
                type="button"
                $variant="secondary"
                onClick={() => navigate(`/clientes/${row.id}/editar`)}
              >
                Editar
              </Button>
              <Button type="button" $variant="danger" onClick={() => setClienteParaExcluir(row)}>
                Excluir
              </Button>
            </>
          )}
        </Actions>
      ),
    },
  ]

  return (
    <div>
      <Header>
        <Title>Clientes</Title>
        {isAdmin && (
          <Button type="button" onClick={() => navigate('/clientes/novo')}>
            Novo cliente
          </Button>
        )}
      </Header>

      <Filters>
        <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Buscar por nome" />
        <Input label="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="Buscar por CPF" />
      </Filters>

      <Table
        columns={columns}
        data={data?.content ?? []}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        emptyMessage={isError ? 'Não foi possível carregar os clientes.' : 'Nenhum cliente encontrado.'}
      />
      <Pagination page={page} totalPages={data?.totalPages ?? 0} onPageChange={setPage} disabled={isLoading} />

      <ConfirmDialog
        isOpen={!!clienteParaExcluir}
        title="Excluir cliente"
        message={`Tem certeza que deseja excluir "${clienteParaExcluir?.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        danger
        isLoading={excluirMutation.isPending}
        onCancel={() => setClienteParaExcluir(null)}
        onConfirm={() => {
          if (clienteParaExcluir) excluirMutation.mutate(clienteParaExcluir.id)
        }}
      />
    </div>
  )
}
