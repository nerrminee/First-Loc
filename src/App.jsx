import { Route, Routes, Navigate } from 'react-router-dom'
import HomePage from './pages/home/HomePage'
import VehiculesPage from './pages/vehicules/VehiculesPage'
import VehiculeDetailsPage from './pages/vehicules/VehiculeDetailsPage'
import ReservationPage from './pages/reservation/ReservationPage'
import LoginPage from './pages/auth/LoginPage'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import DashboardHome from './pages/dashboard/DashboardHome'
import DashboardVehiclesPage from './pages/dashboard/DashboardVehiclesPage'
import DashboardReservationsPage from './pages/dashboard/DashboardReservationsPage'
import DashboardClientsPage from './pages/dashboard/DashboardClientsPage'
import DashboardPaymentsPage from './pages/dashboard/DashboardPaymentsPage'
import DashboardMaintenancePage from './pages/dashboard/DashboardMaintenancePage'
import DashboardExpensesPage from './pages/dashboard/DashboardExpensesPage'
import DashboardUsersPage from './pages/dashboard/DashboardUsersPage'
import DashboardSettingsPage from './pages/dashboard/DashboardSettingsPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/vehicules" element={<VehiculesPage />} />
      <Route path="/vehicules/:id" element={<VehiculeDetailsPage />} />
      <Route path="/reservation" element={<ReservationPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<DashboardHome />} />
        <Route path="vehicules" element={<DashboardVehiclesPage />} />
        <Route path="reservations" element={<DashboardReservationsPage />} />
        <Route path="clients" element={<DashboardClientsPage />} />
        <Route path="paiements" element={<DashboardPaymentsPage />} />
        <Route path="entretiens" element={<DashboardMaintenancePage />} />
        <Route path="depenses" element={<DashboardExpensesPage />} />
        <Route path="utilisateurs" element={<DashboardUsersPage />} />
        <Route path="parametres" element={<DashboardSettingsPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/dashboard/*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
