import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '../../test/testUtils'
import { ConfirmDialog } from './ConfirmDialog'

describe('ConfirmDialog', () => {
  it('não renderiza nada quando isOpen é false', () => {
    renderWithProviders(
      <ConfirmDialog
        isOpen={false}
        title="Excluir cliente"
        message="Tem certeza?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('exibe título e mensagem quando aberto', () => {
    renderWithProviders(
      <ConfirmDialog
        isOpen
        title="Excluir cliente"
        message='Tem certeza que deseja excluir "João"?'
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Excluir cliente')).toBeInTheDocument()
    expect(screen.getByText('Tem certeza que deseja excluir "João"?')).toBeInTheDocument()
  })

  it('chama onConfirm e onCancel nos respectivos botões', async () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    const user = userEvent.setup()
    renderWithProviders(
      <ConfirmDialog
        isOpen
        title="Excluir cliente"
        message="Tem certeza?"
        confirmLabel="Excluir"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Excluir' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('desabilita os botões enquanto isLoading', () => {
    renderWithProviders(
      <ConfirmDialog
        isOpen
        title="Excluir cliente"
        message="Tem certeza?"
        confirmLabel="Excluir"
        isLoading
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    )

    expect(screen.getByRole('button', { name: 'Aguarde...' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled()
  })
})
