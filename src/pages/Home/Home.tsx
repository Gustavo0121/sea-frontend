import styled from 'styled-components'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'

const Wrapper = styled.main`
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
`

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.grayText};
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
`

export function Home() {
  return (
    <Wrapper>
      <Card>
        <Title>SEA Tecnologia</Title>
        <Subtitle>Sistema de Cadastro de Clientes</Subtitle>
        <Button type="button">Começar</Button>
      </Card>
    </Wrapper>
  )
}
