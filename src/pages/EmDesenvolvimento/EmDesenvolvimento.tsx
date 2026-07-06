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

interface EmDesenvolvimentoProps {
  title: string
  message: string
}

export function EmDesenvolvimento({ title, message }: EmDesenvolvimentoProps) {
  return (
    <Card>
      <Title>{title}</Title>
      <Subtitle>{message}</Subtitle>
    </Card>
  )
}
