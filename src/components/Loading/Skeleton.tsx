import styled, { keyframes } from 'styled-components'

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`

export const Skeleton = styled.div<{ width?: string; height?: string }>`
  width: ${({ width = '100%' }) => width};
  height: ${({ height = '1rem' }) => height};
  border-radius: ${({ theme }) => theme.radius.sm};
  background-color: ${({ theme }) => theme.colors.grayLight};
  animation: ${pulse} 1.4s ease-in-out infinite;
`
