import { ThemeProvider } from 'styled-components'
import { describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { theme } from '../styles/theme'
import { tokenStorage } from '../utils/tokenStorage'
import { createFakeJwt } from '../test/fakeJwt'
import { UNAUTHORIZED_EVENT } from '../services/api'
import { AuthProvider } from './AuthProvider'
import { ToastProvider } from './ToastProvider'
import { useAuth } from '../hooks/useAuth'

function Consumer() {
  const { isAuthenticated, logout } = useAuth()
  return (
    <div>
      <span>{isAuthenticated ? 'autenticado' : 'não autenticado'}</span>
      <button type="button" onClick={logout}>
        Sair
      </button>
    </div>
  )
}

function renderAuth() {
  return render(
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <AuthProvider>
          <Consumer />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>,
  )
}

describe('AuthProvider - expiração de sessão', () => {
  it('avisa o usuário e desloga quando a API retorna 401 (token expirado em uso)', async () => {
    const token = createFakeJwt({ sub: '1', username: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 })
    tokenStorage.set(token)

    renderAuth()
    expect(screen.getByText('autenticado')).toBeInTheDocument()

    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))

    expect(await screen.findByText('Sua sessão expirou. Faça login novamente.')).toBeInTheDocument()
    expect(screen.getByText('não autenticado')).toBeInTheDocument()
    expect(tokenStorage.get()).toBeNull()
  })

  it('avisa o usuário quando o app carrega com um token já expirado', async () => {
    const token = createFakeJwt({ sub: '1', exp: Math.floor(Date.now() / 1000) - 60 })
    tokenStorage.set(token)

    renderAuth()

    expect(await screen.findByText('Sua sessão expirou. Faça login novamente.')).toBeInTheDocument()
    expect(screen.getByText('não autenticado')).toBeInTheDocument()
  })

  it('não exibe o aviso de expiração em um logout manual', async () => {
    const token = createFakeJwt({ sub: '1', exp: Math.floor(Date.now() / 1000) + 3600 })
    tokenStorage.set(token)
    const user = userEvent.setup()

    renderAuth()
    await user.click(screen.getByRole('button', { name: 'Sair' }))

    expect(screen.getByText('não autenticado')).toBeInTheDocument()
    expect(screen.queryByText('Sua sessão expirou. Faça login novamente.')).not.toBeInTheDocument()
  })
})
