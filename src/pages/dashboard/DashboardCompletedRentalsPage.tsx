import { useMemo, useState } from 'react'
import { Banknote, Printer, Search, Trash2 } from 'lucide-react'
import { useRentalData } from '../../context/RentalDataContext'
import type { Rental } from '../../types/rental'
import { Empty, Modal, PageHeader, StatusBadge } from '../../components/admin/AdminUI'

const payment = (rental: Rental) => rental.remainingAmount <= 0 ? 'Payé' : rental.amountPaid > 0 ? 'Partiellement payé' : 'Non payé'

export default function DashboardCompletedRentalsPage() {
  const { rentals, vehicles, payRental, deleteRental } = useRentalData()
  const [search, setSearch] = useState('')
  const [vehicle, setVehicle] = useState('')
  const [payStatus, setPayStatus] = useState('')
  const [month, setMonth] = useState('')
  const [detail, setDetail] = useState<Rental | null>(null)
  const [message, setMessage] = useState('')

  const completed = useMemo(() => rentals
    .filter((rental) => rental.status === 'Terminée')
    .filter((rental) => `${rental.clientName} ${rental.phone} ${rental.id}`.toLowerCase().includes(search.toLowerCase()))
    .filter((rental) => !vehicle || rental.vehicleId === vehicle)
    .filter((rental) => !payStatus || payment(rental) === payStatus)
    .filter((rental) => !month || rental.actualReturnDate?.slice(0, 7) === month),
  [rentals, search, vehicle, payStatus, month])

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Archives permanentes" title="Locations terminées" />
      {message && <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">{message}</div>}

      <div className="grid gap-3 rounded-3xl bg-white p-4 shadow-soft md:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Client, téléphone, numéro…" className="w-full pl-11 text-white" />
        </div>
        <select value={vehicle} onChange={(event) => setVehicle(event.target.value)} className="text-white">
          <option value="">Tous les véhicules</option>
          {vehicles.map((item) => <option key={item.id} value={item.id}>{item.brand} {item.model}</option>)}
        </select>
        <select value={payStatus} onChange={(event) => setPayStatus(event.target.value)} className="text-white">
          <option value="">Tous les paiements</option>
          {['Payé', 'Partiellement payé', 'Non payé'].map((status) => <option key={status}>{status}</option>)}
        </select>
        <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} className="text-white" />
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-[1400px] w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                {['N° location', 'Client', 'Téléphone', 'Véhicule', 'Immatriculation', 'Départ', 'Retour', 'KM départ', 'KM retour', 'KM parcourus', 'Prix', 'Frais', 'Final', 'Payé', 'Reste', 'Paiement', 'Actions'].map((heading) => (
                  <th key={heading} className="px-4 py-4 text-xs font-bold uppercase text-slate-500">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {completed.map((rental) => {
                const currentVehicle = vehicles.find((item) => item.id === rental.vehicleId)
                const paymentStatus = payment(rental)
                return (
                  <tr key={rental.id} className="border-t border-slate-100 text-sm text-slate-700">
                    <td className="px-4 py-4 font-semibold">LOC-{rental.id.slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-4 font-semibold text-slate-950">{rental.clientName}</td>
                    <td className="px-4 py-4">{rental.phone}</td>
                    <td className="px-4 py-4">{currentVehicle?.brand} {currentVehicle?.model}</td>
                    <td className="px-4 py-4">{currentVehicle?.registration}</td>
                    <td className="px-4 py-4">{rental.actualStartDate}</td>
                    <td className="px-4 py-4">{rental.actualReturnDate}</td>
                    <td className="px-4 py-4">{rental.startMileage.toLocaleString()}</td>
                    <td className="px-4 py-4">{rental.returnMileage?.toLocaleString()}</td>
                    <td className="px-4 py-4">{rental.distanceDriven?.toLocaleString()}</td>
                    <td className="px-4 py-4">{rental.rentalPrice.toLocaleString()}</td>
                    <td className="px-4 py-4">{rental.extraFees.toLocaleString()}</td>
                    <td className="px-4 py-4 font-semibold">{rental.finalPrice.toLocaleString()}</td>
                    <td className="px-4 py-4">{rental.amountPaid.toLocaleString()}</td>
                    <td className="px-4 py-4">{rental.remainingAmount.toLocaleString()}</td>
                    <td className="px-4 py-4"><StatusBadge tone={paymentStatus === 'Payé' ? 'green' : paymentStatus === 'Non payé' ? 'red' : 'amber'}>{paymentStatus}</StatusBadge></td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => setDetail(rental)} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold">Détails</button>
                        <button onClick={() => { setDetail(rental); window.setTimeout(() => window.print(), 200) }} className="rounded-xl bg-blue-50 p-2 text-blue-700" title="Imprimer"><Printer size={16} /></button>
                        {rental.remainingAmount > 0 && (
                          <button onClick={async () => { if (window.confirm(`Marquer ${rental.remainingAmount.toLocaleString()} DA comme payé ?`)) await payRental(rental, rental.remainingAmount) }} className="rounded-xl bg-emerald-100 p-2 text-emerald-700" title="Marquer payé"><Banknote size={16} /></button>
                        )}
                        <button
                          onClick={async () => {
                            if (!window.confirm(`Supprimer définitivement la location de ${rental.clientName} ?`)) return
                            await deleteRental(rental)
                            setMessage('Ligne supprimée des locations terminées.')
                          }}
                          className="rounded-xl bg-rose-100 p-2 text-rose-700"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {!completed.length && <Empty>Aucune location terminée pour ces filtres.</Empty>}
      </div>

      {detail && (
        <Modal title={`Fiche LOC-${detail.id.slice(-6).toUpperCase()}`} onClose={() => setDetail(null)}>
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            {Object.entries({
              Client: detail.clientName,
              Téléphone: detail.phone,
              Départ: detail.actualStartDate,
              Retour: detail.actualReturnDate,
              'KM parcourus': detail.distanceDriven,
              'Montant final': `${detail.finalPrice.toLocaleString()} DA`,
              'Total payé': `${detail.amountPaid.toLocaleString()} DA`,
              Reste: `${detail.remainingAmount.toLocaleString()} DA`,
            }).map(([key, value]) => (
              <div key={key} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-slate-500">{key}</p>
                <p className="mt-1 font-bold text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  )
}
