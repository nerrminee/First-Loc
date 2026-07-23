import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/vehicules', label: 'Nos véhicules' },
  { to: '/reservation', label: 'Réservation' },
]

export default function PublicLayout() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { admin, logout } = useAuth()
  const handleLogout = async () => { await logout(); navigate('/login', { replace: true }) }

  return (
    <div className="min-h-screen bg-ink text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050713]/85 backdrop-blur-xl">
        <div className="container flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <img src={logo} alt="First Loc DZ" className="h-14 w-16 rounded-xl object-cover object-center mix-blend-screen" />
            <div className="leading-none"><span className="top-brand-name">First Loc <span>DZ</span></span><span className="mt-1 block text-[9px] uppercase tracking-[.32em] text-slate-400">Location de voiture</span></div>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {links.map(({ to, label }) => <NavLink key={to} to={to} className={({ isActive }) => `text-sm font-medium transition hover:text-white ${isActive ? 'text-white' : 'text-slate-400'}`}>{label}</NavLink>)}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            {admin ? <><span className="mr-1 text-xs text-slate-400">{admin.username}</span><Link to="/dashboard" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-slate-300 hover:bg-white/5" title="Tableau de bord"><LayoutDashboard size={18} /></Link><button onClick={handleLogout} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-slate-300 hover:bg-rose-500/10 hover:text-rose-300" title="Déconnexion"><LogOut size={18} /></button></> : <Link to="/login" className="btn-secondary"><LayoutDashboard size={17} /> Espace admin</Link>}
          </div>
          <button className="rounded-xl border border-white/10 p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
        </div>
        {open && <nav className="container flex flex-col gap-2 border-t border-white/10 py-4 md:hidden">
          {links.map(({ to, label }) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-slate-300 hover:bg-white/5 hover:text-white">{label}</NavLink>)}
          {admin ? <><NavLink to="/dashboard" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-slate-300 hover:bg-white/5">Tableau de bord</NavLink><button onClick={handleLogout} className="mt-2 flex items-center gap-2 rounded-xl px-4 py-3 text-left text-rose-300 hover:bg-rose-500/10"><LogOut size={18} /> Déconnexion</button></> : <NavLink to="/login" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-violet-300 hover:bg-white/5">Espace administrateur</NavLink>}
        </nav>}
      </header>
      <Outlet />
    </div>
  )
}
