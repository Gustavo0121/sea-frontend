import styled from 'styled-components'
import { Button } from '../Button'
import { Modal } from '../Modal'

const Message = styled.p`
  color: ${({ theme }) => theme.colors.grayText};
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  isLoading?: boolean
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isLoading = false,
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <Message>{message}</Message>
      <Actions>
        <Button type="button" $variant="secondary" onClick={onCancel} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button
          type="button"
          $variant={danger ? 'danger' : 'primary'}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Aguarde...' : confirmLabel}
        </Button>
      </Actions>
    </Modal>
  )
}
