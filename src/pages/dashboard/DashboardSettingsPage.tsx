export default function DashboardSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-white p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-brand">Paramètres</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-950">Configuration de l entreprise</h2>
      </div>
      <div className="rounded-[2rem] bg-white p-6 shadow-soft text-slate-600">
        <p>Paramètres de l entreprise, frais par kilomètre, dépôt par défaut et informations de contact.</p>
      </div>
    </div>
  )
}
