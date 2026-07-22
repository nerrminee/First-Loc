export default function DashboardHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-white p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-brand">Historique</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-950">Journal d activité</h2>
      </div>
      <div className="rounded-[2rem] bg-white p-6 shadow-soft text-slate-600">
        <p>Les actions importantes seront enregistrées ici : réservations, départs, retours, paiements, maintenance.</p>
      </div>
    </div>
  )
}
