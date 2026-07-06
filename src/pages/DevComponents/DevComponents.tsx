import { useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { Input } from '../../components/Input'
import { Loading, Skeleton } from '../../components/Loading'
import { Modal } from '../../components/Modal'
import { Pagination } from '../../components/Pagination'
import { Table, type TableColumn } from '../../components/Table'
import { useToast } from '../../hooks/useToast'

interface SampleClient {
  id: number
  nome: string
  cpf: string
}

const sampleClients: SampleClient[] = [
  { id: 1, nome: 'João da Silva', cpf: '111.***.***-35' },
  { id: 2, nome: 'Maria Oliveira', cpf: '222.***.***-10' },
  { id: 3, nome: 'Carlos Souza', cpf: '333.***.***-88' },
]

const columns: TableColumn<SampleClient>[] = [
  { key: 'nome', header: 'Nome', render: (row) => row.nome },
  { key: 'cpf', header: 'CPF', render: (row) => row.cpf },
  {
    key: 'acoes',
    header: 'Ações',
    render: () => (
      <Button type="button" $variant="secondary">
        Ver
      </Button>
    ),
  },
]

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
`

export function DevComponents() {
  const { showToast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isLoadingTable, setIsLoadingTable] = useState(false)
  const [page, setPage] = useState(0)

  return (
    <div>
      <Section>
        <SectionTitle>Button</SectionTitle>
        <Row>
          <Button type="button">Primary</Button>
          <Button type="button" $variant="secondary">
            Secondary
          </Button>
          <Button type="button" $variant="danger">
            Danger
          </Button>
          <Button type="button" disabled>
            Disabled
          </Button>
        </Row>
      </Section>

      <Section>
        <SectionTitle>Input</SectionTitle>
        <Row>
          <Input label="Nome" placeholder="Digite o nome" />
          <Input label="Com erro" error="Campo obrigatório" />
        </Row>
      </Section>

      <Section>
        <SectionTitle>Card</SectionTitle>
        <Card style={{ maxWidth: 280 }}>Conteúdo de exemplo dentro de um Card.</Card>
      </Section>

      <Section>
        <SectionTitle>Toast</SectionTitle>
        <Row>
          <Button type="button" onClick={() => showToast('Operação realizada com sucesso.', 'success')}>
            Disparar sucesso
          </Button>
          <Button
            type="button"
            $variant="secondary"
            onClick={() => showToast('Não foi possível concluir a operação.', 'error')}
          >
            Disparar erro
          </Button>
        </Row>
      </Section>

      <Section>
        <SectionTitle>Modal</SectionTitle>
        <Button type="button" onClick={() => setIsModalOpen(true)}>
          Abrir modal
        </Button>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Exemplo de Modal">
          <p>Conteúdo qualquer dentro do modal.</p>
        </Modal>
      </Section>

      <Section>
        <SectionTitle>ConfirmDialog</SectionTitle>
        <Button type="button" $variant="danger" onClick={() => setIsConfirmOpen(true)}>
          Excluir cliente
        </Button>
        <ConfirmDialog
          isOpen={isConfirmOpen}
          title="Excluir cliente"
          message="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
          confirmLabel="Excluir"
          danger
          onCancel={() => setIsConfirmOpen(false)}
          onConfirm={() => {
            setIsConfirmOpen(false)
            showToast('Cliente excluído com sucesso.', 'success')
          }}
        />
      </Section>

      <Section>
        <SectionTitle>Loading / Skeleton</SectionTitle>
        <Row>
          <Loading />
          <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton />
            <Skeleton width="60%" />
          </div>
        </Row>
      </Section>

      <Section>
        <SectionTitle>Table / Pagination</SectionTitle>
        <Button type="button" $variant="secondary" onClick={() => setIsLoadingTable((v) => !v)}>
          {isLoadingTable ? 'Mostrar dados' : 'Mostrar loading'}
        </Button>
        <Table
          columns={columns}
          data={sampleClients}
          keyExtractor={(row) => row.id}
          isLoading={isLoadingTable}
        />
        <Pagination page={page} totalPages={5} onPageChange={setPage} />
      </Section>
    </div>
  )
}
