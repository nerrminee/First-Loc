export default function DashboardMaintenancePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-white p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-brand">Entretiens</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-950">Gestion de la maintenance</h2>
      </div>
      <div className="rounded-[2rem] bg-white p-6 shadow-soft text-slate-600">
        <p>Suivi des entretiens, alertes de maintenance et historique des interventions.</p>
      </div>
    </div>
  )
}
