import styled from 'styled-components'

export const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.orange};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transition.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.orangeDark};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.grayMedium};
    cursor: not-allowed;
  }
`
