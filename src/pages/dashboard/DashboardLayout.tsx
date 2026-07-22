import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Home, CalendarDays, Car, ClipboardList, Users, CreditCard, Wrench, FileText, Settings, LogOut, DollarSign } from 'lucide-react'

const menu = [
  { label: 'Tableau de bord', to: '/dashboard', icon: Home },
  { label: 'Calendrier', to: '/dashboard/calendrier', icon: CalendarDays },
  { label: 'Véhicules', to: '/dashboard/vehicules', icon: Car },
  { label: 'Réservations', to: '/dashboard/reservations', icon: ClipboardList },
  { label: 'Clients', to: '/dashboard/clients', icon: Users },
  { label: 'Paiements', to: '/dashboard/paiements', icon: CreditCard },
  { label: 'Entretiens', to: '/dashboard/entretiens', icon: Wrench },
  { label: 'Dépenses', to: '/dashboard/depenses', icon: DollarSign },
  { label: 'Historique', to: '/dashboard/historique', icon: FileText },
  { label: 'Utilisateurs', to: '/dashboard/utilisateurs', icon: Users },
  { label: 'Paramètres', to: '/dashboard/parametres', icon: Settings }
]

export default function DashboardLayout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userRole')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="container mx-auto grid min-h-screen gap-8 xl:grid-cols-[280px_1fr]">
        <aside className="rounded-[2rem] bg-white p-6 shadow-soft">
          <div className="mb-10 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-brand text-white">5</div>
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-brand">5 FIRST LOC DZ</p>
              <p className="text-sm text-slate-600">Tableau de bord</p>
            </div>
          </div>
          <nav className="space-y-2">
            {menu.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.to} to={item.to} className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                  <Icon size={18} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <button onClick={handleLogout} className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-3xl border border-slate-200 px-4 py-3 text-slate-700 hover:bg-slate-50">
            <LogOut size={18} /> Déconnexion
          </button>
        </aside>

        <section className="space-y-8">
          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-brand">Bonjour, administrateur</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-950">Bienvenue sur votre espace de gestion.</h1>
              </div>
            </div>
          </div>
          <Outlet />
        </section>
      </div>
    </div>
  )
}
