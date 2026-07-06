import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { MainLayout } from '../layouts'
import { Clientes } from '../pages/Clientes'
import { Dashboard } from '../pages/Dashboard'
import { DevComponents } from '../pages/DevComponents'
import { EmDesenvolvimento } from '../pages/EmDesenvolvimento'
import { Login } from '../pages/Login/Login'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/', element: <Dashboard /> },
          { path: '/clientes', element: <Clientes /> },
          {
            path: '/clientes/novo',
            element: (
              <EmDesenvolvimento
                title="Cadastro de cliente"
                message="O formulário de cadastro será implementado na Fase 5."
              />
            ),
          },
          {
            path: '/clientes/:id/editar',
            element: (
              <EmDesenvolvimento
                title="Edição de cliente"
                message="O formulário de edição será implementado na Fase 5."
              />
            ),
          },
          {
            path: '/clientes/:id',
            element: (
              <EmDesenvolvimento
                title="Detalhes do cliente"
                message="A visualização de detalhes será implementada na Fase 6."
              />
            ),
          },
          { path: '/dev/components', element: <DevComponents /> },
        ],
      },
    ],
  },
])
