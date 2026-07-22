export default function DashboardUsersPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-white p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-brand">Utilisateurs</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-950">Gestion des accès</h2>
      </div>
      <div className="rounded-[2rem] bg-white p-6 shadow-soft text-slate-600">
        <p>Gestion des administrateurs et des gestionnaires. Seuls les administrateurs peuvent supprimer des enregistrements.</p>
      </div>
    </div>
  )
}
