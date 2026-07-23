import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Car, Eye, EyeOff, Lock, LogIn, ShieldCheck, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logoImage from '../../assets/logo.png'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { admin, loading, login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (!username.trim() || !password) return setError('Veuillez renseigner votre nom d’utilisateur et votre mot de passe.')
    try {
      await login(username.trim(), password)
      const destination = (location.state as { from?: string } | null)?.from ?? '/dashboard'
      navigate(destination, { replace: true })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Impossible de se connecter.')
    }
  }

  if (!loading && admin) return <Navigate to="/dashboard" replace />

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-ink px-4 py-10 text-white">
      <div className="glow glow-one" /><div className="glow glow-two" />
      <div className="relative w-full max-w-5xl">
        <div className="mb-8 text-center">
          <div className="logo-showcase mx-auto">
            <img src={logoImage} alt="Logo officiel First Loc DZ" className="h-full w-full object-contain mix-blend-screen" />
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-[.35em] text-slate-400">Bienvenue chez</p>
          <h1 className="brand-wordmark mt-2">First Loc <span>DZ</span></h1>
          <p className="mt-3 text-sm text-slate-400">Location de voitures · Élégance, liberté, confiance</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <section className="flex flex-col justify-between rounded-[2rem] border border-blue-400/20 bg-gradient-to-br from-blue-600/20 to-[#0d1020]/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
            <div><div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-500 text-white"><Car size={27} /></div><p className="mt-7 text-xs font-bold uppercase tracking-[.25em] text-blue-300">Espace clients</p><h2 className="mt-3 text-3xl font-black">Trouvez votre véhicule</h2><p className="mt-4 leading-7 text-slate-400">Découvrez notre flotte, consultez les détails et envoyez votre demande de réservation.</p></div>
            <Link to="/" className="btn-primary mt-10 w-full py-4">Accéder au site client <ArrowRight size={18} /></Link>
          </section>
          <section id="admin-login" className="rounded-[2rem] border border-violet-400/20 bg-[#0d1020]/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
            <div className="mb-6"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-violet-600 text-white"><ShieldCheck size={27} /></div><p className="mt-7 text-xs font-bold uppercase tracking-[.25em] text-violet-300">Espace sécurisé</p><h2 className="mt-3 text-3xl font-black">Administration</h2><p className="mt-2 text-sm text-slate-400">Réservé aux administrateurs First Loc DZ.</p></div>
            <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-300">Nom d’utilisateur</span><span className="relative block"><User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input autoFocus autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full py-4 pl-12 pr-4" placeholder="Votre nom d’utilisateur" /></span></label>
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-300">Mot de passe</span><span className="relative block"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full py-4 pl-12 pr-12" placeholder="••••••••" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white" aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>
          {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full py-4 disabled:opacity-60"><LogIn size={19} /> {loading ? 'Connexion…' : 'Connexion administrateur'}</button>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}
