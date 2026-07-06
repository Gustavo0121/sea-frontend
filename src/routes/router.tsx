import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { MainLayout } from '../layouts'
import { DevComponents } from '../pages/DevComponents'
import { Home } from '../pages/Home/Home'
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
          { path: '/', element: <Home /> },
          { path: '/dev/components', element: <DevComponents /> },
        ],
      },
    ],
  },
])
