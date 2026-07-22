import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Circle, Fuel, Users } from 'lucide-react'
import { demoVehicles } from '../../data/vehicles'

const statusClasses = {
  Disponible: 'bg-emerald-100 text-emerald-800',
  Réservé: 'bg-amber-100 text-amber-800',
  'En location': 'bg-sky-100 text-sky-800',
  'En entretien': 'bg-orange-100 text-orange-800',
  Indisponible: 'bg-rose-100 text-rose-800'
}

export default function VehiculeDetailsPage() {
  const { id } = useParams()
  const vehicle = useMemo(() => demoVehicles.find((item) => item.id === id), [id])

  if (!vehicle) {
    return (
      <main className="min-h-screen bg-surface px-4 py-16 text-slate-900">
        <div className="container mx-auto rounded-3xl bg-white p-10 shadow-soft text-center">
          <p className="text-lg font-semibold">Véhicule introuvable</p>
          <Link to="/vehicules" className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 text-white">
            Retour aux véhicules
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-surface px-4 py-10 text-slate-900">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link to="/vehicules" className="inline-flex items-center gap-2 text-brand transition hover:text-brand-dark">
              <ArrowLeft size={18} /> Retour aux véhicules
            </Link>
            <h1 className="mt-4 text-4xl font-semibold text-slate-950">{vehicle.marque} {vehicle.modele}</h1>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">Prix par jour</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{vehicle.prix_par_jour} DZD</p>
            <p className="mt-1 text-sm text-slate-600">Caution: {vehicle.caution.toLocaleString()} DZD</p>
            <Link to="/reservation" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand px-6 py-3 text-white transition hover:bg-brand-dark">
              Demander une réservation
            </Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {vehicle.galerie.map((image, index) => (
                <img key={index} src={image} alt={`${vehicle.modele} ${index + 1}`} className="h-64 w-full rounded-[1.75rem] object-cover" />
              ))}
            </div>
            <div className="rounded-[2rem] bg-white p-8 shadow-soft">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-4 py-2 text-sm font-semibold ${statusClasses[vehicle.statut]}`}>
                  {vehicle.statut}
                </span>
                <span className="text-sm text-slate-500">Prochain entretien: {vehicle.prochain_entretien}</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Immatriculation</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{vehicle.immatriculation}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Kilométrage</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{vehicle.kilometrage.toLocaleString()} km</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Boîte</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{vehicle.boite}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Carburant</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{vehicle.carburant}</p>
                </div>
              </div>
            </div>
          </div>
          <aside className="space-y-6">
            <div className="rounded-[2rem] bg-white p-8 shadow-soft">
              <h2 className="text-xl font-semibold text-slate-950">Informations détaillées</h2>
              <ul className="mt-6 space-y-4 text-slate-600">
                <li className="flex items-center gap-3"><Circle size={18} /><span>{vehicle.places} places</span></li>
                <li className="flex items-center gap-3"><MapPin size={18} /><span>Couleur {vehicle.couleur}</span></li>
                <li className="flex items-center gap-3"><Users size={18} /><span>Année {vehicle.annee}</span></li>
                <li className="flex items-center gap-3"><Fuel size={18} /><span>{vehicle.carburant}</span></li>
                <li className="flex items-center gap-3"><Calendar size={18} /><span>Entretien {vehicle.prochain_entretien}</span></li>
              </ul>
            </div>
            <div className="rounded-[2rem] bg-brand px-8 py-8 text-white shadow-soft">
              <h3 className="text-xl font-semibold">Conditions de location</h3>
              <p className="mt-4 text-sm leading-7 text-white/90">
                Les demandes sont traitées par notre équipe. Le véhicule reste soumis à validation et disponibilité réelles.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                <li>• Vérification du permis</li>
                <li>• Paiement du dépôt</li>
                <li>• Livraison et retour sur site ou sur rendez-vous</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
