import { demoVehicles } from '../../data/vehicles'

export default function DashboardReservationsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-white p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-brand">Réservations</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-950">Gestion des demandes</h2>
      </div>
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-soft">
        <table className="min-w-full border-collapse text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Réservation</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Client</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Véhicule</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Statut</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {demoVehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-t border-slate-200">
                <td className="px-6 py-4">RES-{vehicle.id.slice(-4)}</td>
                <td className="px-6 py-4">Client exemple</td>
                <td className="px-6 py-4">{vehicle.marque} {vehicle.modele}</td>
                <td className="px-6 py-4">À confirmer</td>
                <td className="px-6 py-4">
                  <button className="rounded-full bg-brand px-4 py-2 text-sm text-white">Voir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
