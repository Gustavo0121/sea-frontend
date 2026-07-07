import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '../../test/testUtils'
import { Input } from './Input'

describe('Input', () => {
  it('associa o label ao campo e aceita digitação', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Input label="Nome" />)

    const input = screen.getByLabelText('Nome')
    await user.type(input, 'Maria')
    expect(input).toHaveValue('Maria')
  })

  it('exibe a mensagem de erro e marca aria-invalid quando há erro', () => {
    renderWithProviders(<Input label="Email" error="Email inválido." />)

    expect(screen.getByText('Email inválido.')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  })

  it('não exibe mensagem de erro quando não há erro', () => {
    renderWithProviders(<Input label="Email" />)

    expect(screen.queryByText('Email inválido.')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'false')
  })

  it('encaminha a ref para o elemento input nativo', () => {
    const ref = createRef<HTMLInputElement>()
    renderWithProviders(<Input label="Telefone" ref={ref} onChange={() => {}} value="" />)

    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('desabilita o campo quando disabled', () => {
    renderWithProviders(<Input label="Nome" disabled />)
    expect(screen.getByLabelText('Nome')).toBeDisabled()
  })

  it('dispara onChange ao digitar', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()
    renderWithProviders(<Input label="Nome" value="" onChange={handleChange} />)

    await user.type(screen.getByLabelText('Nome'), 'A')
    expect(handleChange).toHaveBeenCalled()
  })
})
