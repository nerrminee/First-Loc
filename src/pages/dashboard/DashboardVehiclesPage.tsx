import { Link } from 'react-router-dom'
import { demoVehicles } from '../../data/vehicles'

const statusClasses = {
  Disponible: 'bg-emerald-100 text-emerald-800',
  Réservé: 'bg-amber-100 text-amber-800',
  'En location': 'bg-sky-100 text-sky-800',
  'En entretien': 'bg-orange-100 text-orange-800',
  Indisponible: 'bg-rose-100 text-rose-800'
}

export default function DashboardVehiclesPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand">Véhicules</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Gestion de la flotte</h2>
          </div>
          <button className="rounded-3xl bg-brand px-5 py-3 text-white transition hover:bg-brand-dark">Ajouter un véhicule</button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] bg-white shadow-soft">
        <table className="min-w-full border-collapse text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Photo</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Véhicule</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Kilométrage</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Prix / jour</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Statut</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {demoVehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-t border-slate-200">
                <td className="px-6 py-4">
                  <img src={vehicle.photo_principale} alt={vehicle.modele} className="h-16 w-24 rounded-3xl object-cover" />
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-950">{vehicle.marque} {vehicle.modele}</div>
                  <div className="text-sm text-slate-500">{vehicle.version}</div>
                </td>
                <td className="px-6 py-4 text-slate-700">{vehicle.kilometrage.toLocaleString()} km</td>
                <td className="px-6 py-4 text-slate-700">{vehicle.prix_par_jour.toLocaleString()} DZD</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusClasses[vehicle.statut]}`}>
                    {vehicle.statut}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link to={`/vehicules/${vehicle.id}`} className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-200">
                    Voir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
