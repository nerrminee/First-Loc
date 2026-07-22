export default function DashboardClientsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-white p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-brand">Clients</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-950">Base client</h2>
      </div>
      <div className="rounded-[2rem] bg-white p-6 shadow-soft text-slate-600">
        <p>Aucun client réel n a encore été ajouté. Cette section sera utilisée pour le suivi des clients et documents.</p>
      </div>
    </div>
  )
}
