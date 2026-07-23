import { useState, type FormEvent } from 'react'
import { Banknote, Play, RotateCcw } from 'lucide-react'
import { useRentalData } from '../../context/RentalDataContext'
import type { Rental, Reservation, ReturnRentalInput } from '../../types/rental'
import { Empty, Field, Modal, PageHeader, StatusBadge } from '../../components/admin/AdminUI'
import { StartRentalModal } from './DashboardReservationsPage'

const today = () => new Date().toISOString().slice(0, 10)
const payment = (rental: Rental) => rental.remainingAmount <= 0 ? 'Payé' : rental.amountPaid > 0 ? 'Partiellement payé' : 'Non payé'
const rentalState = (rental: Rental) => rental.plannedEndDate < today() ? 'En retard' : rental.plannedEndDate === today() ? "Retour aujourd'hui" : 'En cours'

export default function DashboardActiveRentalsPage() {
  const { reservations, rentals, vehicles, startRental, payRental, returnRental } = useRentalData()
  const accepted = reservations
    .filter((reservation) => reservation.status === 'Acceptée' && !reservation.rentalId)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
  const active = rentals.filter((rental) => rental.status === 'En cours')
  const [pickup, setPickup] = useState<Reservation | null>(null)
  const [returning, setReturning] = useState<Rental | null>(null)
  const [paying, setPaying] = useState<Rental | null>(null)
  const [message, setMessage] = useState('')

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Réservations acceptées et parc en circulation" title="Locations en cours" />
      {message && <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">{message}</div>}

      <section className="overflow-hidden rounded-3xl bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Réservations acceptées</h2>
            <p className="mt-1 text-sm text-slate-500">Clients qui doivent récupérer leur véhicule.</p>
          </div>
          <StatusBadge tone="amber">{accepted.length} à récupérer</StatusBadge>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                {['N° réservation', 'Client', 'Téléphone', 'Véhicule', 'Immatriculation', 'Départ', 'Retour prévu', 'Jours', 'Prix', 'Actions'].map((heading) => (
                  <th key={heading} className="px-4 py-4 text-xs font-bold uppercase text-slate-500">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accepted.map((reservation) => {
                const vehicle = vehicles.find((candidate) => candidate.id === reservation.vehicleId)
                return (
                  <tr key={reservation.id} className="border-t border-slate-100 text-sm text-slate-700">
                    <td className="px-4 py-4 font-semibold">RES-{reservation.id.slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-4 font-semibold text-slate-950">{reservation.clientName}</td>
                    <td className="px-4 py-4">{reservation.phone}</td>
                    <td className="px-4 py-4">{vehicle?.brand} {vehicle?.model}</td>
                    <td className="px-4 py-4">{vehicle?.registration}</td>
                    <td className="px-4 py-4">{reservation.startDate}</td>
                    <td className="px-4 py-4">{reservation.endDate}</td>
                    <td className="px-4 py-4">{reservation.days}</td>
                    <td className="px-4 py-4 font-semibold">{reservation.totalPrice.toLocaleString()} DA</td>
                    <td className="px-4 py-4">
                      <button onClick={() => setPickup(reservation)} className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white">
                        <Play size={15} /> Véhicule récupéré
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {!accepted.length && <Empty>Aucune réservation acceptée en attente de récupération.</Empty>}
      </section>

      <section className="overflow-hidden rounded-3xl bg-white shadow-soft">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-xl font-bold text-slate-950">Véhicules actuellement loués</h2>
          <p className="mt-1 text-sm text-slate-500">Locations démarrées après la remise du véhicule.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                {['N° location', 'Client', 'Téléphone', 'Véhicule', 'Immatriculation', 'Départ', 'Retour prévu', 'KM départ', 'Jours', 'Prix', 'Payé', 'Reste', 'Paiement', 'Location', 'Actions'].map((heading) => (
                  <th key={heading} className="px-4 py-4 text-xs font-bold uppercase text-slate-500">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {active.map((rental) => {
                const vehicle = vehicles.find((candidate) => candidate.id === rental.vehicleId)
                const state = rentalState(rental)
                const paymentState = payment(rental)
                return (
                  <tr key={rental.id} className="border-t border-slate-100 text-sm text-slate-700">
                    <td className="px-4 py-4 font-semibold">LOC-{rental.id.slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-4 font-semibold text-slate-950">{rental.clientName}</td>
                    <td className="px-4 py-4">{rental.phone}</td>
                    <td className="px-4 py-4">{vehicle?.brand} {vehicle?.model}</td>
                    <td className="px-4 py-4">{vehicle?.registration}</td>
                    <td className="px-4 py-4">{rental.actualStartDate}</td>
                    <td className="px-4 py-4">{rental.plannedEndDate}</td>
                    <td className="px-4 py-4">{rental.startMileage.toLocaleString()}</td>
                    <td className="px-4 py-4">{Math.max(1, Math.ceil((new Date(rental.plannedEndDate).getTime() - new Date(rental.plannedStartDate).getTime()) / 86400000))}</td>
                    <td className="px-4 py-4">{rental.finalPrice.toLocaleString()}</td>
                    <td className="px-4 py-4">{rental.amountPaid.toLocaleString()}</td>
                    <td className="px-4 py-4 font-semibold">{rental.remainingAmount.toLocaleString()}</td>
                    <td className="px-4 py-4"><StatusBadge tone={paymentState === 'Payé' ? 'green' : paymentState === 'Non payé' ? 'red' : 'amber'}>{paymentState}</StatusBadge></td>
                    <td className="px-4 py-4"><StatusBadge tone={state === 'En retard' ? 'red' : state.includes('aujourd') ? 'amber' : 'blue'}>{state}</StatusBadge></td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => setPaying(rental)} className="inline-flex gap-1 rounded-xl bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-800"><Banknote size={15} /> Paiement</button>
                        <button onClick={() => setReturning(rental)} className="inline-flex gap-1 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white"><RotateCcw size={15} /> Retour</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {!active.length && <Empty>Aucun véhicule actuellement loué.</Empty>}
      </section>

      {pickup && (
        <StartRentalModal
          reservation={pickup}
          onClose={() => setPickup(null)}
          onSubmit={async (input) => {
            await startRental(pickup, input)
            setPickup(null)
            setMessage('Location démarrée. Le véhicule est maintenant loué.')
          }}
        />
      )}
      {paying && <PaymentModal rental={paying} onClose={() => setPaying(null)} onSave={async (amount) => { await payRental(paying, amount); setPaying(null); setMessage('Paiement ajouté.') }} />}
      {returning && <ReturnModal rental={returning} onClose={() => setReturning(null)} onSave={async (input) => { await returnRental(returning, input); setReturning(null); setMessage('Retour validé, kilométrage et statut du véhicule mis à jour.') }} />}
    </div>
  )
}

function PaymentModal({ rental, onClose, onSave }: { rental: Rental; onClose: () => void; onSave: (amount: number) => Promise<void> }) {
  const [amount, setAmount] = useState(rental.remainingAmount)
  const [error, setError] = useState('')
  return (
    <Modal title="Ajouter un paiement" onClose={onClose}>
      <form onSubmit={async (event) => { event.preventDefault(); try { await onSave(amount) } catch (caught) { setError(caught instanceof Error ? caught.message : 'Erreur') } }} className="space-y-5">
        <p className="text-sm text-slate-600">Reste actuel : <strong>{rental.remainingAmount.toLocaleString()} DA</strong></p>
        <Field label="Montant reçu"><input required min="1" type="number" value={amount} onChange={(event) => setAmount(+event.target.value)} className="w-full text-slate-900" /></Field>
        {error && <p className="text-rose-600">{error}</p>}
        <button className="btn-primary w-full">Enregistrer le paiement</button>
      </form>
    </Modal>
  )
}

function ReturnModal({ rental, onClose, onSave }: { rental: Rental; onClose: () => void; onSave: (input: ReturnRentalInput) => Promise<void> }) {
  const [form, setForm] = useState<ReturnRentalInput>({
    actualReturnDate: today(),
    actualReturnTime: new Date().toTimeString().slice(0, 5),
    returnMileage: rental.startMileage,
    fuelReturn: 'Plein',
    returnCondition: 'Bon état',
    extraFees: 0,
    extraFeesReason: '',
    paymentAtReturn: 0,
    notes: '',
    maintenanceRequired: false,
  })
  const [error, setError] = useState('')
  const set = (key: keyof ReturnRentalInput, value: string | number | boolean) => setForm((current) => ({ ...current, [key]: value }))
  const final = rental.rentalPrice + form.extraFees
  const paid = rental.amountPaid + form.paymentAtReturn
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!window.confirm('Confirmer définitivement le retour du véhicule ?')) return
    try {
      await onSave(form)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Erreur')
    }
  }

  return (
    <Modal title="Retour du véhicule" onClose={onClose}>
      <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
        <Field label="Date réelle retour"><input required type="date" value={form.actualReturnDate} onChange={(event) => set('actualReturnDate', event.target.value)} className="w-full text-slate-900" /></Field>
        <Field label="Heure retour"><input required type="time" value={form.actualReturnTime} onChange={(event) => set('actualReturnTime', event.target.value)} className="w-full text-slate-900" /></Field>
        <Field label="KM retour"><input required min={rental.startMileage} type="number" value={form.returnMileage} onChange={(event) => set('returnMileage', +event.target.value)} className="w-full text-slate-900" /></Field>
        <Field label="KM parcourus"><input readOnly value={Math.max(0, form.returnMileage - rental.startMileage)} className="w-full bg-slate-100 text-slate-900" /></Field>
        <Field label="Carburant retour"><select value={form.fuelReturn} onChange={(event) => set('fuelReturn', event.target.value)} className="w-full text-slate-900">{['Plein', '3/4', '1/2', '1/4', 'Réserve'].map((value) => <option key={value}>{value}</option>)}</select></Field>
        <Field label="État au retour"><input required value={form.returnCondition} onChange={(event) => set('returnCondition', event.target.value)} className="w-full text-slate-900" /></Field>
        <Field label="Frais supplémentaires"><input min="0" type="number" value={form.extraFees} onChange={(event) => set('extraFees', +event.target.value)} className="w-full text-slate-900" /></Field>
        <Field label="Raison des frais"><input value={form.extraFeesReason} onChange={(event) => set('extraFeesReason', event.target.value)} className="w-full text-slate-900" /></Field>
        <Field label="Paiement au retour"><input min="0" type="number" value={form.paymentAtReturn} onChange={(event) => set('paymentAtReturn', +event.target.value)} className="w-full text-slate-900" /></Field>
        <Field label="Notes"><textarea value={form.notes} onChange={(event) => set('notes', event.target.value)} className="w-full text-slate-900" /></Field>
        <label className="sm:col-span-2 flex gap-3 rounded-2xl bg-orange-50 p-4 text-sm font-semibold text-orange-900"><input type="checkbox" checked={form.maintenanceRequired} onChange={(event) => set('maintenanceRequired', event.target.checked)} /> Véhicule à placer en entretien</label>
        <div className="sm:col-span-2 rounded-2xl bg-slate-950 p-5 text-white">
          <div className="flex justify-between"><span>Montant final</span><strong>{final.toLocaleString()} DA</strong></div>
          <div className="mt-2 flex justify-between text-slate-300"><span>Reste à payer</span><strong>{Math.max(0, final - paid).toLocaleString()} DA</strong></div>
        </div>
        {error && <p className="sm:col-span-2 text-rose-600">{error}</p>}
        <button className="btn-primary sm:col-span-2">Valider le retour</button>
      </form>
    </Modal>
  )
}
