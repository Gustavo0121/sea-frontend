import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(6, 43, 61, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  z-index: 1100;
`

const Content = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  line-height: 1;
  color: ${({ theme }) => theme.colors.grayText};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};

  &:hover {
    color: ${({ theme }) => theme.colors.black};
  }
`

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <Overlay onClick={onClose}>
      <Content
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <Header>
          {title && <Title>{title}</Title>}
          <CloseButton type="button" aria-label="Fechar" onClick={onClose}>
            &times;
          </CloseButton>
        </Header>
        {children}
      </Content>
    </Overlay>,
    document.body,
  )
}
