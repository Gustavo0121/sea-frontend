import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { Loading } from '../../components/Loading'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { clienteService } from '../../services/clienteService'
import type { TipoTelefone } from '../../types/cliente'

const TIPO_TELEFONE_LABELS: Record<TipoTelefone, string> = {
  CELULAR: 'Celular',
  RESIDENCIAL: 'Residencial',
  COMERCIAL: 'Comercial',
}

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
`

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.grayText};
  margin: 0;
`

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.blueDark};
  margin: ${({ theme }) => theme.spacing.xl} 0 ${({ theme }) => theme.spacing.md};
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

const FieldLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.blueDark};
`

const FieldValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.black};
`

const ListItem = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayLight};

  &:last-child {
    border-bottom: none;
  }
`

export function ClienteDetalhe() {
  const { id } = useParams<{ id: string }>()
  const clienteId = Number(id)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const isAdmin = user?.role === 'ADMIN'

  const [confirmarExclusao, setConfirmarExclusao] = useState(false)

  const clienteQuery = useQuery({
    queryKey: ['clientes', clienteId],
    queryFn: () => clienteService.buscarPorId(clienteId),
  })

  const excluirMutation = useMutation({
    mutationFn: () => clienteService.excluir(clienteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
      showToast('Cliente excluído com sucesso.', 'success')
      navigate('/clientes')
    },
    onError: () => {
      showToast('Não foi possível excluir o cliente.', 'error')
      setConfirmarExclusao(false)
    },
  })

  if (clienteQuery.isLoading) {
    return <Loading />
  }

  if (clienteQuery.isError || !clienteQuery.data) {
    return (
      <Card>
        <Title>Cliente não encontrado</Title>
        <Subtitle>Não foi possível carregar os dados deste cliente.</Subtitle>
      </Card>
    )
  }

  const cliente = clienteQuery.data

  return (
    <Card>
      <Header>
        <Title>{cliente.nome}</Title>
        <Actions>
          <Button type="button" $variant="secondary" onClick={() => navigate('/clientes')}>
            Voltar
          </Button>
          {isAdmin && (
            <>
              <Button type="button" onClick={() => navigate(`/clientes/${cliente.id}/editar`)}>
                Editar
              </Button>
              <Button type="button" $variant="danger" onClick={() => setConfirmarExclusao(true)}>
                Excluir
              </Button>
            </>
          )}
        </Actions>
      </Header>

      <Grid>
        <Field>
          <FieldLabel>Nome</FieldLabel>
          <FieldValue>{cliente.nome}</FieldValue>
        </Field>
        <Field>
          <FieldLabel>CPF</FieldLabel>
          <FieldValue>{cliente.cpf}</FieldValue>
        </Field>
      </Grid>

      <SectionTitle>Endereço</SectionTitle>
      <Grid>
        <Field>
          <FieldLabel>CEP</FieldLabel>
          <FieldValue>{cliente.endereco.cep}</FieldValue>
        </Field>
        <Field>
          <FieldLabel>Logradouro</FieldLabel>
          <FieldValue>{cliente.endereco.logradouro}</FieldValue>
        </Field>
        <Field>
          <FieldLabel>Bairro</FieldLabel>
          <FieldValue>{cliente.endereco.bairro}</FieldValue>
        </Field>
        <Field>
          <FieldLabel>Cidade</FieldLabel>
          <FieldValue>{cliente.endereco.cidade}</FieldValue>
        </Field>
        <Field>
          <FieldLabel>UF</FieldLabel>
          <FieldValue>{cliente.endereco.uf}</FieldValue>
        </Field>
        <Field>
          <FieldLabel>Complemento</FieldLabel>
          <FieldValue>{cliente.endereco.complemento || '—'}</FieldValue>
        </Field>
      </Grid>

      <SectionTitle>Telefones</SectionTitle>
      {cliente.telefones.map((telefone, index) => (
        <ListItem key={index}>
          {TIPO_TELEFONE_LABELS[telefone.tipo]}: {telefone.numero}
        </ListItem>
      ))}

      <SectionTitle>Emails</SectionTitle>
      {cliente.emails.map((email, index) => (
        <ListItem key={index}>{email.endereco}</ListItem>
      ))}

      <ConfirmDialog
        isOpen={confirmarExclusao}
        title="Excluir cliente"
        message={`Tem certeza que deseja excluir "${cliente.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        danger
        isLoading={excluirMutation.isPending}
        onCancel={() => setConfirmarExclusao(false)}
        onConfirm={() => excluirMutation.mutate()}
      />
    </Card>
  )
}
