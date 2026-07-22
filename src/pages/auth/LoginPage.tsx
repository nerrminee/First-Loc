import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (email.trim() === '' || password.trim() === '') {
      setError('Veuillez renseigner votre e-mail et votre mot de passe.')
      return
    }
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('userRole', 'Administrateur')
    navigate('/dashboard')
  }

  return (
    <main className="min-h-screen bg-surface px-4 py-10 text-slate-900">
      <div className="container mx-auto grid min-h-[calc(100vh-80px)] place-items-center">
        <div className="w-full max-w-xl rounded-3xl bg-white p-10 shadow-soft">
          <div className="mb-8 flex items-center gap-4 rounded-3xl bg-brand-light p-4 text-brand">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white">
              <Lock size={24} />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-dark">5 FIRST LOC DZ</p>
              <h1 className="text-2xl font-semibold">Connexion au tableau de bord</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900"
                placeholder="votre@email.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-2xl bg-brand px-6 py-4 text-white transition hover:bg-brand-dark"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
