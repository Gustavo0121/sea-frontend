import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { Home } from '../pages/Home/Home'
import { Login } from '../pages/Login/Login'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [{ path: '/', element: <Home /> }],
  },
])
