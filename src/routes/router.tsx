import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { MainLayout } from '../layouts'
import { Clientes } from '../pages/Clientes'
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
          { path: '/dev/components', element: <DevComponents /> },
        ],
      },
    ],
  },
])
