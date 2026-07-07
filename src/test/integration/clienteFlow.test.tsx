import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor, within } from '@testing-library/react'
import App from '../../App'
import { createFakeJwt } from '../fakeJwt'
import { server } from '../mocks/server'
import { tokenStorage } from '../../utils/tokenStorage'
import type { Cliente } from '../../types/cliente'

const API = import.meta.env.VITE_API_URL

function buildCliente(overrides: Partial<Cliente> & { id: number; nome: string; cpf: string }): Cliente {
  return {
    endereco: {
      cep: '01310100',
      logradouro: 'Av. Paulista',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
      complemento: null,
    },
    telefones: [{ tipo: 'CELULAR', numero: '11988887777' }],
    emails: [{ endereco: 'maria@example.com' }],
    ...overrides,
  }
}

describe('fluxo principal: login -> listagem -> cadastro -> edição -> exclusão', () => {
  let clientes: Cliente[]
  let nextId: number

  beforeEach(() => {
    clientes = [buildCliente({ id: 1, nome: 'Maria Souza', cpf: '11144477735' })]
    nextId = 2

    server.use(
      http.post(`${API}/auth/login`, async ({ request }) => {
        const body = (await request.json()) as { login: string; senha: string }
        if (body.login !== 'admin' || body.senha !== 'senha-correta') {
          return HttpResponse.json({ message: 'Credenciais inválidas' }, { status: 401 })
        }
        const token = createFakeJwt({
          sub: '1',
          username: 'admin',
          role: 'ADMIN',
          exp: Math.floor(Date.now() / 1000) + 3600,
        })
        return HttpResponse.json({ token, tipo: 'Bearer', expiraEmSegundos: 3600 })
      }),

      http.get(`${API}/clientes`, () => {
        return HttpResponse.json({
          content: clientes,
          totalElements: clientes.length,
          totalPages: 1,
          number: 0,
          size: 10,
        })
      }),

      http.get(`${API}/clientes/:id`, ({ params }) => {
        const cliente = clientes.find((item) => item.id === Number(params.id))
        return cliente ? HttpResponse.json(cliente) : new HttpResponse(null, { status: 404 })
      }),

      http.post(`${API}/clientes`, async ({ request }) => {
        const dto = (await request.json()) as Omit<Cliente, 'id'>
        const created: Cliente = { ...dto, id: nextId++ }
        clientes.push(created)
        return HttpResponse.json(created, { status: 201 })
      }),

      http.put(`${API}/clientes/:id`, async ({ params, request }) => {
        const dto = (await request.json()) as Omit<Cliente, 'id'>
        const id = Number(params.id)
        const updated: Cliente = { ...dto, id }
        clientes = clientes.map((item) => (item.id === id ? updated : item))
        return HttpResponse.json(updated)
      }),

      http.delete(`${API}/clientes/:id`, ({ params }) => {
        clientes = clientes.filter((item) => item.id !== Number(params.id))
        return new HttpResponse(null, { status: 204 })
      }),

      http.get(`${API}/enderecos/:cep`, () => {
        return HttpResponse.json({
          logradouro: 'Av. Paulista',
          bairro: 'Bela Vista',
          cidade: 'São Paulo',
          uf: 'SP',
          complemento: null,
        })
      }),
    )
  })

  afterEach(() => {
    tokenStorage.clear()
    window.history.pushState({}, '', '/')
  })

  it('permite logar, listar, cadastrar, editar e excluir um cliente', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '/')
    render(<App />)

    // Login
    await user.type(await screen.findByLabelText('Usuário'), 'admin')
    await user.type(screen.getByLabelText('Senha'), 'senha-correta')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    // Dashboard
    expect(await screen.findByRole('heading', { name: /Olá, admin/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Ver todos os clientes' }))

    // Listagem
    expect(await screen.findByRole('heading', { name: 'Clientes' })).toBeInTheDocument()
    expect(await screen.findByText('Maria Souza')).toBeInTheDocument()

    // Cadastro
    await user.click(screen.getByRole('button', { name: 'Novo cliente' }))
    expect(await screen.findByRole('heading', { name: 'Novo cliente' })).toBeInTheDocument()

    await user.type(screen.getByLabelText('Nome'), 'José Pereira')
    await user.type(screen.getByLabelText('CPF'), '11144477735')
    await user.type(screen.getByLabelText('CEP'), '01310100')
    await user.tab()
    await waitFor(() => expect(screen.getByLabelText('Logradouro')).toHaveValue('Av. Paulista'))

    await user.type(screen.getByLabelText('Número'), '11988887777')
    await user.type(screen.getByLabelText('Email'), 'jose@example.com')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    // De volta à listagem, com o novo cliente
    expect(await screen.findByRole('heading', { name: 'Clientes' })).toBeInTheDocument()
    expect(await screen.findByText('José Pereira')).toBeInTheDocument()

    // Edição
    const joseRow = screen.getByText('José Pereira').closest('tr')!
    await user.click(within(joseRow).getByRole('button', { name: 'Editar' }))

    expect(await screen.findByRole('heading', { name: 'Editar cliente' })).toBeInTheDocument()
    const nomeInput = await screen.findByLabelText('Nome')
    await waitFor(() => expect(nomeInput).toHaveValue('José Pereira'))

    await user.clear(nomeInput)
    await user.type(nomeInput, 'José Pereira Filho')
    await user.type(screen.getByLabelText('CPF'), '11144477735')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByRole('heading', { name: 'Clientes' })).toBeInTheDocument()
    expect(await screen.findByText('José Pereira Filho')).toBeInTheDocument()

    // Exclusão
    const updatedRow = screen.getByText('José Pereira Filho').closest('tr')!
    await user.click(within(updatedRow).getByRole('button', { name: 'Excluir' }))

    const dialog = await screen.findByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Excluir' }))

    await waitFor(() => expect(screen.queryByText('José Pereira Filho')).not.toBeInTheDocument())
    expect(screen.getByText('Maria Souza')).toBeInTheDocument()
  })
})
