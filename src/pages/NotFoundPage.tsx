import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-surface px-4 py-20 text-slate-900">
      <div className="container mx-auto rounded-3xl bg-white p-10 shadow-soft">
        <div className="text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-brand">Page introuvable</p>
          <h1 className="mb-4 text-4xl font-semibold text-slate-900">404 - Oups</h1>
          <p className="mx-auto max-w-xl text-slate-600">
            La page que vous recherchez n existe pas. Retournez à l accueil ou consultez le tableau de bord.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/" className="rounded-full bg-brand px-6 py-3 text-white transition hover:bg-brand-dark">
              Accueil
            </Link>
            <Link to="/login" className="rounded-full border border-slate-200 px-6 py-3 text-slate-700 transition hover:bg-slate-100">
              Connexion
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
