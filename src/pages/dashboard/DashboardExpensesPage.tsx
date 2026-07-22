export default function DashboardExpensesPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-white p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-brand">Dépenses</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-950">Suivi des dépenses</h2>
      </div>
      <div className="rounded-[2rem] bg-white p-6 shadow-soft text-slate-600">
        <p>Ajouter des dépenses et consulter les totaux mensuels et annuels.</p>
      </div>
    </div>
  )
}
