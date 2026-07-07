import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { MainLayout } from '../layouts'
import { Clientes } from '../pages/Clientes'
import { ClienteDetalhe } from '../pages/ClienteDetalhe'
import { ClienteForm } from '../pages/ClienteForm'
import { Dashboard } from '../pages/Dashboard'
import { Login } from '../pages/Login/Login'

// Rota de showcase de componentes: existe apenas para desenvolvimento e é
// eliminada do bundle de produção (import.meta.env.DEV é inlined pelo Vite).
const devRoutes: RouteObject[] = import.meta.env.DEV
  ? [
      {
        path: '/dev/components',
        lazy: async () => {
          const { DevComponents } = await import('../pages/DevComponents')
          return { Component: DevComponents }
        },
      },
    ]
  : []

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
          { path: '/clientes/novo', element: <ClienteForm /> },
          { path: '/clientes/:id/editar', element: <ClienteForm /> },
          { path: '/clientes/:id', element: <ClienteDetalhe /> },
          ...devRoutes,
        ],
      },
    ],
  },
])
