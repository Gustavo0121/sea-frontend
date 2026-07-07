import styled, { css } from 'styled-components'

export type ButtonVariant = 'primary' | 'secondary' | 'danger'

const variantStyles = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.orange};
    color: ${({ theme }) => theme.colors.white};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.orangeDark};
    }
  `,
  secondary: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.petrol};
    border: 1px solid ${({ theme }) => theme.colors.grayMedium};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.grayLight};
    }
  `,
  danger: css`
    background-color: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.white};

    &:hover:not(:disabled) {
      background-color: #b83a3a;
    }
  `,
}

export const Button = styled.button<{ $variant?: ButtonVariant }>`
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition:
    background-color ${({ theme }) => theme.transition.fast},
    border-color ${({ theme }) => theme.transition.fast};

  ${({ $variant = 'primary' }) => variantStyles[$variant]}

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.petrol};
    outline-offset: 2px;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.grayMedium};
    border-color: ${({ theme }) => theme.colors.grayMedium};
    color: ${({ theme }) => theme.colors.white};
    cursor: not-allowed;
  }
`
