import styled from 'styled-components'
import { Card } from '../../components/Card'

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.grayText};
  margin: 0;
`

export function Clientes() {
  return (
    <Card>
      <Title>Clientes</Title>
      <Subtitle>A listagem de clientes será implementada na próxima fase.</Subtitle>
    </Card>
  )
}
