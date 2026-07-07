import styled, { type DefaultTheme } from 'styled-components'
import type { ToastType } from '../../context/toastContext'

export const ToastViewport = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  max-width: 360px;
`

const borderColor = (type: ToastType, theme: DefaultTheme) => {
  switch (type) {
    case 'success':
      return theme.colors.success
    case 'error':
      return theme.colors.error
    default:
      return theme.colors.petrol
  }
}

export const ToastItemView = styled.div<{ $type: ToastType }>`
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
  border-left: 4px solid ${({ $type, theme }) => borderColor($type, theme)};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
`
