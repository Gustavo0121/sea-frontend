import styled from 'styled-components'

export const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.md};
  padding: ${({ theme }) => theme.spacing.lg};
  transition: box-shadow ${({ theme }) => theme.transition.normal};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }
`
