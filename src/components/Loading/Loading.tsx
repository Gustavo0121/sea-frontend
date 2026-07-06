import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const Spinner = styled.div<{ $size: string }>`
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  border: 3px solid ${({ theme }) => theme.colors.grayLight};
  border-top-color: ${({ theme }) => theme.colors.petrol};
  border-radius: ${({ theme }) => theme.radius.full};
  animation: ${spin} 700ms linear infinite;
`

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
`

interface LoadingProps {
  size?: string
  label?: string
}

export function Loading({ size = '32px', label = 'Carregando...' }: LoadingProps) {
  return (
    <Center role="status" aria-live="polite">
      <Spinner $size={size} aria-label={label} />
    </Center>
  )
}
