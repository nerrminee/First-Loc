import { useMemo } from 'react'
import { BarChart2, Clock, DollarSign, Inbox, MapPin, ShieldCheck, Users, Wrench } from 'lucide-react'
import { demoVehicles } from '../../data/vehicles'

const cards = [
  { title: 'Nombre total de véhicules', value: demoVehicles.length, icon: MapPin },
  { title: 'Véhicules disponibles', value: demoVehicles.filter((item) => item.statut === 'Disponible').length, icon: ShieldCheck },
  { title: 'Véhicules en location', value: demoVehicles.filter((item) => item.statut === 'En location').length, icon: Clock },
  { title: 'Véhicules en entretien', value: demoVehicles.filter((item) => item.statut === 'En entretien').length, icon: Wrench }
]

const revenueData = [
  { month: 'Jan', revenue: 180000 },
  { month: 'Fév', revenue: 220000 },
  { month: 'Mar', revenue: 240000 },
  { month: 'Avr', revenue: 260000 },
  { month: 'Mai', revenue: 280000 }
]

export default function DashboardHome() {
  const upcomingMaintenance = useMemo(() => demoVehicles.filter((vehicle) => new Date(vehicle.prochain_entretien) > new Date()).slice(0, 3), [])

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <article key={card.title} className="rounded-[2rem] bg-brand-light p-6 shadow-soft">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-brand text-white">
                <Icon size={20} />
              </div>
              <p className="mt-6 text-sm uppercase tracking-[0.3em] text-brand-dark">{card.title}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{card.value}</p>
            </article>
          )
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand">Chiffre d affaires</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">1 180 000 DZD</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-2 text-brand">
              <DollarSign size={16} /> Ce mois
            </div>
          </div>
          <div className="mt-8 h-72 rounded-[1.75rem] bg-slate-50 p-6">
            <p className="text-slate-500">Graphique des revenus mensuels (placeholder)</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-brand">Retours à venir</p>
            <ul className="mt-6 space-y-4">
              {demoVehicles.filter((item) => item.statut === 'En location').map((vehicle) => (
                <li key={vehicle.id} className="rounded-3xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-950">{vehicle.marque} {vehicle.modele}</p>
                  <p className="text-sm text-slate-600">Retour prévu : 3 jours</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-brand">Entretiens à venir</p>
            <ul className="mt-6 space-y-4">
              {upcomingMaintenance.map((vehicle) => (
                <li key={vehicle.id} className="rounded-3xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-950">{vehicle.marque} {vehicle.modele}</p>
                  <p className="text-sm text-slate-600">Prévu le {vehicle.prochain_entretien}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
