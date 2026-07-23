import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter } from 'lucide-react'
import { usePublicVehicles } from '../../hooks/usePublicVehicles'

const statuses = ['Disponible', 'Réservé', 'En location', 'En entretien', 'Indisponible'] as const
const transmissions = ['Automatique', 'Manuelle'] as const

const getBadgeClass = (status: string) => {
  switch (status) {
    case 'Disponible': return 'bg-emerald-100 text-emerald-800'
    case 'Réservé': return 'bg-amber-100 text-amber-800'
    case 'En location': return 'bg-sky-100 text-sky-800'
    case 'En entretien': return 'bg-orange-100 text-orange-800'
    default: return 'bg-rose-100 text-rose-800'
  }
}

export default function VehiculesPage() {
  const publicVehicles = usePublicVehicles()
  const [selectedStatus, setSelectedStatus] = useState('')
  const [search, setSearch] = useState('')
  const [transmission, setTransmission] = useState('')
  const [marque, setMarque] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const marques = useMemo(() => Array.from(new Set(publicVehicles.map((vehicle) => vehicle.marque))), [publicVehicles])

  const filteredVehicles = useMemo(() => {
    return publicVehicles.filter((vehicle) => {
      const matchesStatus = selectedStatus ? vehicle.statut === selectedStatus : true
      const matchesMarque = marque ? vehicle.marque === marque : true
      const matchesTransmission = transmission ? vehicle.boite === transmission : true
      const matchesPrice = maxPrice ? vehicle.prix_par_jour <= Number(maxPrice) : true
      const matchesSearch = search ? `${vehicle.marque} ${vehicle.modele}`.toLowerCase().includes(search.toLowerCase()) : true
      return matchesStatus && matchesMarque && matchesTransmission && matchesPrice && matchesSearch
    })
  }, [publicVehicles, selectedStatus, marque, transmission, maxPrice, search])

  return (
    <main className="bg-surface px-4 py-10 text-slate-900">
      <div className="container mx-auto">
        <div className="mb-10 rounded-[2rem] bg-white p-10 shadow-soft">
          <div className="mb-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand">Véhicules</p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-950">Parcourez notre flotte disponible</h1>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-slate-700">
              <Filter size={16} />
              Filtres actifs
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">Statut</label>
              <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)} className="w-full">
                <option value="">Tous</option>
                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">Marque</label>
              <select value={marque} onChange={(event) => setMarque(event.target.value)} className="w-full">
                <option value="">Tous</option>
                {marques.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
              </select>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">Boîte</label>
              <select value={transmission} onChange={(event) => setTransmission(event.target.value)} className="w-full">
                <option value="">Tous</option>
                {transmissions.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">Prix max (DZD)</label>
              <input type="number" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="10000" className="w-full" />
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4">
            <div className="relative flex items-center gap-3">
              <Search size={18} className="text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher une marque ou un modèle"
                className="w-full bg-transparent px-2 py-3 text-slate-900 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {filteredVehicles.map((vehicle) => (
            <article key={vehicle.id} className="overflow-hidden rounded-[2rem] bg-white shadow-soft">
              <img src={vehicle.photo_principale} alt={vehicle.modele} className="h-56 w-full object-cover" />
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getBadgeClass(vehicle.statut)}`}>
                    {vehicle.statut}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">{vehicle.prix_par_jour} DZD / jour</span>
                </div>
                <h2 className="text-xl font-semibold text-slate-950">{vehicle.marque} {vehicle.modele}</h2>
                <p className="mt-2 text-sm text-slate-600">{vehicle.version} • {vehicle.annee}</p>
                <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                  <div>{vehicle.boite}</div>
                  <div>{vehicle.carburant}</div>
                  <div>{vehicle.places} places</div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to={`/vehicules/${vehicle.id}`} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100">
                    Voir les détails
                  </Link>
                  {vehicle.statut === 'Disponible' && (
                    <Link to="/reservation" className="rounded-full bg-brand px-4 py-2 text-sm text-white transition hover:bg-brand-dark">
                      Réserver
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
