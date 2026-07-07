import styled from 'styled-components'
import { Button } from '../Button'

interface PaginationProps {
  /** Página atual, base zero (mesma convenção do Pageable do backend) */
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} 0;
`

const PageInfo = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.grayText};
`

export function Pagination({ page, totalPages, onPageChange, disabled = false }: PaginationProps) {
  if (totalPages <= 1) return null

  const isFirstPage = page <= 0
  const isLastPage = page >= totalPages - 1

  return (
    <Wrapper>
      <Button
        type="button"
        $variant="secondary"
        onClick={() => onPageChange(page - 1)}
        disabled={disabled || isFirstPage}
      >
        Anterior
      </Button>
      <PageInfo>
        Página {page + 1} de {totalPages}
      </PageInfo>
      <Button
        type="button"
        $variant="secondary"
        onClick={() => onPageChange(page + 1)}
        disabled={disabled || isLastPage}
      >
        Próxima
      </Button>
    </Wrapper>
  )
}
