import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const location = useLocation()
  const { admin, loading } = useAuth()
  if (loading) return <div className="grid min-h-screen place-items-center bg-slate-950 text-sm font-semibold text-white">Vérification de la session…</div>
  return admin ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />
}
