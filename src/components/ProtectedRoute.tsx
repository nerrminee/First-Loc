import { Navigate } from 'react-router-dom'

const isAuthenticated = () => {
  return !!localStorage.getItem('isAuthenticated')
}

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />
}
