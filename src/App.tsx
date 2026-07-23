import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/home/HomePage'
import VehiculesPage from './pages/vehicules/VehiculesPage'
import VehiculeDetailsPage from './pages/vehicules/VehiculeDetailsPage'
import ReservationPage from './pages/reservation/ReservationPage'
import LoginPage from './pages/auth/LoginPage'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import DashboardHome from './pages/dashboard/DashboardHome'
import DashboardCalendarPage from './pages/dashboard/DashboardCalendarPage'
import DashboardVehiclesPage from './pages/dashboard/DashboardVehiclesPage'
import DashboardReservationsPage from './pages/dashboard/DashboardReservationsPage'
import DashboardClientsPage from './pages/dashboard/DashboardClientsPage'
import DashboardPaymentsPage from './pages/dashboard/DashboardPaymentsPage'
import DashboardMaintenancePage from './pages/dashboard/DashboardMaintenancePage'
import DashboardExpensesPage from './pages/dashboard/DashboardExpensesPage'
import DashboardHistoryPage from './pages/dashboard/DashboardHistoryPage'
import DashboardUsersPage from './pages/dashboard/DashboardUsersPage'
import DashboardSettingsPage from './pages/dashboard/DashboardSettingsPage'
import DashboardActiveRentalsPage from './pages/dashboard/DashboardActiveRentalsPage'
import DashboardCompletedRentalsPage from './pages/dashboard/DashboardCompletedRentalsPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/ProtectedRoute'
import PublicLayout from './components/PublicLayout'
import BrandSplash from './components/BrandSplash'

function App() {
  return (
    <><BrandSplash /><Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/vehicules" element={<VehiculesPage />} />
        <Route path="/vehicules/:id" element={<VehiculeDetailsPage />} />
        <Route path="/reservation" element={<ReservationPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="calendrier" element={<DashboardCalendarPage />} />
          <Route path="vehicules" element={<DashboardVehiclesPage />} />
          <Route path="reservations" element={<DashboardReservationsPage />} />
          <Route path="locations-en-cours" element={<DashboardActiveRentalsPage />} />
          <Route path="locations-terminees" element={<DashboardCompletedRentalsPage />} />
          <Route path="clients" element={<DashboardClientsPage />} />
          <Route path="paiements" element={<DashboardPaymentsPage />} />
          <Route path="entretiens" element={<DashboardMaintenancePage />} />
          <Route path="depenses" element={<DashboardExpensesPage />} />
          <Route path="historique" element={<DashboardHistoryPage />} />
          <Route path="utilisateurs" element={<DashboardUsersPage />} />
          <Route path="parametres" element={<DashboardSettingsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes></>
  )
}

export default App
