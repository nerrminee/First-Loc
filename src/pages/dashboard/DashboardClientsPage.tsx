import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Search } from 'lucide-react'
import { useRentalData } from '../../context/RentalDataContext'
import { Empty, PageHeader, StatusBadge } from '../../components/admin/AdminUI'

export default function DashboardClientsPage() {
  const { reservations, rentals, loading } = useRentalData()
  const [search, setSearch] = useState('')

  const clients = useMemo(() => {
    const byPhone = new Map<string, {
      name: string
      phone: string
      reservations: number
      rentals: number
      source: 'En ligne' | 'Téléphone'
      lastActivity: string
    }>()

    reservations.forEach((reservation) => {
      const key = reservation.phone.trim() || reservation.clientName
      const current = byPhone.get(key)
      byPhone.set(key, {
        name: reservation.clientName,
        phone: reservation.phone,
        reservations: (current?.reservations || 0) + 1,
        rentals: current?.rentals || 0,
        source: reservation.source === 'Téléphone' ? 'Téléphone' : current?.source || 'En ligne',
        lastActivity: current && current.lastActivity > reservation.createdAt ? current.lastActivity : reservation.createdAt,
      })
    })

    rentals.forEach((rental) => {
      const key = rental.phone.trim() || rental.clientName
      const current = byPhone.get(key)
      byPhone.set(key, {
        name: rental.clientName,
        phone: rental.phone,
        reservations: current?.reservations || 0,
        rentals: (current?.rentals || 0) + 1,
        source: current?.source || 'Téléphone',
        lastActivity: current && current.lastActivity > rental.updatedAt ? current.lastActivity : rental.updatedAt,
      })
    })

    return [...byPhone.values()]
      .filter((client) => `${client.name} ${client.phone}`.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.lastActivity.localeCompare(a.lastActivity))
  }, [reservations, rentals, search])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Clients"
        title="Base client"
        action={
          <Link to="/dashboard/reservations" className="btn-primary">
            <Phone size={17} /> Ajouter par téléphone
          </Link>
        }
      />

      <div className="rounded-3xl bg-white p-4 shadow-soft">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un client…" className="w-full bg-slate-50 pl-11 text-slate-900" />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                {['Client', 'Téléphone', 'Canal', 'Réservations', 'Locations', 'Dernière activité'].map((heading) => (
                  <th key={heading} className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={`${client.phone}-${client.name}`} className="border-t border-slate-100 text-sm text-slate-700">
                  <td className="px-5 py-4 font-semibold text-slate-950">{client.name}</td>
                  <td className="px-5 py-4">{client.phone}</td>
                  <td className="px-5 py-4"><StatusBadge tone={client.source === 'Téléphone' ? 'blue' : 'slate'}>{client.source}</StatusBadge></td>
                  <td className="px-5 py-4">{client.reservations}</td>
                  <td className="px-5 py-4">{client.rentals}</td>
                  <td className="px-5 py-4">{new Date(client.lastActivity).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && !clients.length && <Empty>Aucun client enregistré.</Empty>}
      </div>
    </div>
  )
}
