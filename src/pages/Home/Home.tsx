import styled from 'styled-components'
import { Card } from '../../components/Card'
import { useAuth } from '../../hooks/useAuth'

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.grayText};
  margin: 0;
`

export function Home() {
  const { user } = useAuth()

  return (
    <Card>
      <Title>Olá, {user?.username ?? user?.sub}</Title>
      <Subtitle>Sistema de Cadastro de Clientes</Subtitle>
    </Card>
  )
}
