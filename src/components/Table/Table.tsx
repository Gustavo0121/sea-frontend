import type { ReactNode } from 'react'
import styled from 'styled-components'
import { Skeleton } from '../Loading'

export interface TableColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  width?: string
}

interface TableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  keyExtractor: (row: T) => string | number
  isLoading?: boolean
  emptyMessage?: string
  skeletonRows?: number
}

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.md};
  overflow-x: auto;
`

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const Thead = styled.thead`
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayLight};
`

const Th = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.grayText};
  white-space: nowrap;
`

const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayLight};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.grayLightest};
  }
`

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.black};
`

const EmptyRow = styled.td`
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
  color: ${({ theme }) => theme.colors.grayText};
`

export function Table<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'Nenhum registro encontrado.',
  skeletonRows = 5,
}: TableProps<T>) {
  return (
    <Wrapper>
      <StyledTable>
        <Thead>
          <tr>
            {columns.map((column) => (
              <Th key={column.key} style={{ width: column.width }}>
                {column.header}
              </Th>
            ))}
          </tr>
        </Thead>
        <tbody>
          {isLoading &&
            Array.from({ length: skeletonRows }).map((_, rowIndex) => (
              <Tr key={rowIndex}>
                {columns.map((column) => (
                  <Td key={column.key}>
                    <Skeleton height="1rem" />
                  </Td>
                ))}
              </Tr>
            ))}

          {!isLoading && data.length === 0 && (
            <tr>
              <EmptyRow colSpan={columns.length}>{emptyMessage}</EmptyRow>
            </tr>
          )}

          {!isLoading &&
            data.map((row) => (
              <Tr key={keyExtractor(row)}>
                {columns.map((column) => (
                  <Td key={column.key}>{column.render(row)}</Td>
                ))}
              </Tr>
            ))}
        </tbody>
      </StyledTable>
    </Wrapper>
  )
}
