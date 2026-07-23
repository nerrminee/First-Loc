import { useState } from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { useRentalData } from '../../context/RentalDataContext'
import { PageHeader } from '../../components/admin/AdminUI'

export default function DashboardSettingsPage() {
  const { clearTestData } = useRentalData()
  const [clearing, setClearing] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const clear = async () => {
    const confirmation = window.prompt('Cette action supprimera toutes les réservations, locations et entretiens. Tapez SUPPRIMER pour confirmer.')
    if (confirmation !== 'SUPPRIMER') return
    setClearing(true)
    setMessage('')
    setError('')
    try {
      const result = await clearTestData()
      setMessage(`${result.reservations} réservation(s), ${result.rentals} location(s) et ${result.maintenance} entretien(s) supprimés. Tous les véhicules sont disponibles.`)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Impossible de supprimer les données de test.')
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Paramètres" title="Configuration de l’entreprise" />
      {message && <div className="rounded-2xl bg-emerald-50 p-5 text-sm font-semibold text-emerald-800">{message}</div>}
      {error && <div className="rounded-2xl bg-rose-50 p-5 text-sm font-semibold text-rose-700">{error}</div>}

      <section className="rounded-3xl border border-rose-200 bg-white p-6 shadow-soft">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose-100 text-rose-700"><AlertTriangle size={24} /></div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-950">Supprimer les données de test</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Supprime toutes les réservations, locations et fiches d’entretien. Les véhicules et leurs informations sont conservés, puis leur statut passe à « Disponible ».
            </p>
            <button disabled={clearing} onClick={clear} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-700 disabled:opacity-60">
              <Trash2 size={17} /> {clearing ? 'Suppression…' : 'Nettoyer les données de test'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
