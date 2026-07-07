import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '../../test/testUtils'
import { Button } from './Button'

describe('Button', () => {
  it('dispara onClick ao ser clicado', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    renderWithProviders(<Button onClick={handleClick}>Salvar</Button>)

    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('não dispara onClick quando disabled', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    renderWithProviders(
      <Button onClick={handleClick} disabled>
        Salvar
      </Button>,
    )

    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(handleClick).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled()
  })

  it('renderiza as variantes sem quebrar', () => {
    const { rerender } = renderWithProviders(<Button $variant="primary">Ação</Button>)
    expect(screen.getByRole('button', { name: 'Ação' })).toBeInTheDocument()

    rerender(<Button $variant="secondary">Ação</Button>)
    expect(screen.getByRole('button', { name: 'Ação' })).toBeInTheDocument()

    rerender(<Button $variant="danger">Ação</Button>)
    expect(screen.getByRole('button', { name: 'Ação' })).toBeInTheDocument()
  })
})
