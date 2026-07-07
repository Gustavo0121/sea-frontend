import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { MainLayout } from '../layouts'
import { Clientes } from '../pages/Clientes'
import { ClienteDetalhe } from '../pages/ClienteDetalhe'
import { ClienteForm } from '../pages/ClienteForm'
import { Dashboard } from '../pages/Dashboard'
import { DevComponents } from '../pages/DevComponents'
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
          { path: '/clientes/novo', element: <ClienteForm /> },
          { path: '/clientes/:id/editar', element: <ClienteForm /> },
          { path: '/clientes/:id', element: <ClienteDetalhe /> },
          { path: '/dev/components', element: <DevComponents /> },
        ],
      },
    ],
  },
])
