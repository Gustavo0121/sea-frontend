import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Table, type TableColumn } from '../../components/Table'
import { useAuth } from '../../hooks/useAuth'
import { useClientesResumo } from '../../hooks/useClientesResumo'
import type { Cliente } from '../../types/cliente'

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.grayText};
  margin: 0;
`

const CardsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`

const StatCard = styled(Card)`
  min-width: 220px;
`

const StatLabel = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.grayText};
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
`

const StatValue = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.petrol};
  margin: 0;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`

const columns: TableColumn<Cliente>[] = [
  { key: 'nome', header: 'Nome', render: (row) => row.nome },
  { key: 'cpf', header: 'CPF', render: (row) => row.cpf },
]

export function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useClientesResumo()

  return (
    <div>
      <Header>
        <Title>Olá, {user?.username ?? user?.sub}</Title>
        <Subtitle>Sistema de Cadastro de Clientes</Subtitle>
      </Header>

      <CardsRow>
        <StatCard>
          <StatLabel>Total de clientes</StatLabel>
          <StatValue>{isLoading ? '—' : isError ? '—' : data?.totalElements}</StatValue>
        </StatCard>
      </CardsRow>

      <SectionHeader>
        <SectionTitle>Últimos cadastrados</SectionTitle>
        <Button type="button" onClick={() => navigate('/clientes')}>
          Ver todos os clientes
        </Button>
      </SectionHeader>
      <Table
        columns={columns}
        data={data?.content ?? []}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        emptyMessage={isError ? 'Não foi possível carregar os clientes.' : 'Nenhum cliente cadastrado.'}
      />
    </div>
  )
}
