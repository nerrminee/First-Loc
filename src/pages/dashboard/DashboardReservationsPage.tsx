import { useState, type FormEvent } from 'react'
import { Check, CheckCircle2, Eye, Phone, Play, Search, Sparkles, X } from 'lucide-react'
import { useRentalData } from '../../context/RentalDataContext'
import type { AdminVehicle, Reservation, StartRentalInput } from '../../types/rental'
import { Empty, Field, Modal, PageHeader, StatusBadge } from '../../components/admin/AdminUI'

const statusTone = (status: Reservation['status']) =>
  status === 'Acceptée' ? 'green' : status === 'En attente' ? 'amber' : status === 'Refusée' ? 'red' : 'slate'

const addDays = (date: string, days: number) => {
  if (!date || days < 1) return ''
  const [year, month, day] = date.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10)
}

export default function DashboardReservationsPage() {
  const { reservations, vehicles, changeReservationStatus, addManualReservation, startRental, loading, hasConflict } = useRentalData()
  const [search, setSearch] = useState('')
  const [detail, setDetail] = useState<Reservation | null>(null)
  const [pickup, setPickup] = useState<Reservation | null>(null)
  const [manualOpen, setManualOpen] = useState(false)
  const [message, setMessage] = useState('')

  const filtered = reservations
    .filter((item) => `${item.clientName} ${item.phone} ${item.id}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const act = async (reservation: Reservation, status: Reservation['status']) => {
    if (!window.confirm(`${status === 'Acceptée' ? 'Accepter' : 'Refuser'} cette réservation ?`)) return
    try {
      await changeReservationStatus(reservation.id, status)
      setMessage(status === 'Acceptée'
        ? `La réservation de ${reservation.clientName} a été acceptée avec succès.`
        : `La réservation de ${reservation.clientName} a été refusée.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erreur')
    }
  }

  const detailVehicle = detail ? vehicles.find((vehicle) => vehicle.id === detail.vehicleId) : undefined

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Commandes clients"
        title="Réservations"
        action={
          <button onClick={() => setManualOpen(true)} className="btn-primary">
            <Phone size={17} /> Ajouter par téléphone
          </button>
        }
      />

      {message && <ReservationNotice message={message} onClose={() => setMessage('')} />}

      <div className="rounded-3xl bg-white p-4 shadow-soft">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un client, téléphone ou numéro…" className="w-full bg-slate-50 pl-11 text-slate-900" />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-[1350px] w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                {['N° réservation', 'Date', 'Client', 'Téléphone', 'Canal', 'Véhicule', 'Début', 'Fin', 'Jours', 'Prix total', 'Statut', 'Actions'].map((heading) => (
                  <th key={heading} className="px-4 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const vehicle = vehicles.find((candidate) => candidate.id === item.vehicleId)
                return (
                  <tr key={item.id} className="border-t border-slate-100 text-sm text-slate-700">
                    <td className="px-4 py-4 font-semibold">RES-{item.id.slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-4">{new Date(item.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td className="px-4 py-4 font-semibold text-slate-950">{item.clientName}</td>
                    <td className="px-4 py-4">{item.phone}</td>
                    <td className="px-4 py-4"><StatusBadge tone={item.source === 'Téléphone' ? 'blue' : 'slate'}>{item.source || 'En ligne'}</StatusBadge></td>
                    <td className="px-4 py-4">{vehicle?.brand} {vehicle?.model}</td>
                    <td className="px-4 py-4">{item.startDate}</td>
                    <td className="px-4 py-4">{item.endDate}</td>
                    <td className="px-4 py-4">{item.days}</td>
                    <td className="px-4 py-4 font-semibold">{item.totalPrice.toLocaleString()} DA</td>
                    <td className="px-4 py-4">
                      <StatusBadge tone={statusTone(item.status)}>{item.status}</StatusBadge>
                      {hasConflict(item) && item.status === 'En attente' && <p className="mt-1 text-xs text-rose-600">Conflit de dates</p>}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => setDetail(item)} className="rounded-xl bg-slate-100 p-2" title="Voir"><Eye size={16} /></button>
                        {item.status === 'En attente' && (
                          <>
                            <button onClick={() => act(item, 'Acceptée')} className="rounded-xl bg-emerald-100 p-2 text-emerald-700" title="Accepter"><Check size={16} /></button>
                            <button onClick={() => act(item, 'Refusée')} className="rounded-xl bg-rose-100 p-2 text-rose-700" title="Refuser"><X size={16} /></button>
                          </>
                        )}
                        {item.status === 'Acceptée' && !item.rentalId && (
                          <button onClick={() => setPickup(item)} className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white">
                            <Play size={15} /> Véhicule récupéré
                          </button>
                        )}
                        {item.rentalId && <StatusBadge tone="blue">Location démarrée</StatusBadge>}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {!loading && !filtered.length && <Empty>Aucune réservation reçue.</Empty>}
      </div>

      {manualOpen && (
        <ManualReservationModal
          vehicles={vehicles}
          onClose={() => setManualOpen(false)}
          onSave={async (data) => {
            await addManualReservation(data)
            setManualOpen(false)
            setMessage('Réservation téléphonique ajoutée. Vous pouvez maintenant l’accepter.')
          }}
        />
      )}

      {detail && (
        <Modal title="Détails de la réservation" onClose={() => setDetail(null)}>
          <div className="grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
            {Object.entries({
              Client: detail.clientName,
              Téléphone: detail.phone,
              Canal: detail.source || 'En ligne',
              'Date de départ': detail.startDate,
              'Nombre de jours': detail.days,
              Véhicule: detailVehicle ? `${detailVehicle.brand} ${detailVehicle.model}` : '—',
              'Prix total': `${detail.totalPrice.toLocaleString()} DA`,
            }).map(([key, value]) => (
              <div key={key} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">{key}</p>
                <p className="mt-1 font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}

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
    </div>
  )
}

function ReservationNotice({ message, onClose }: { message: string; onClose: () => void }) {
  const isError = message.includes('Conflit') || message.includes('Erreur') || message.includes('Impossible')
  const isAccepted = message.includes('acceptée avec succès')

  return (
    <div className={`relative overflow-hidden rounded-3xl border p-5 shadow-xl ${
      isError
        ? 'border-rose-300/30 bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-rose-900/15'
        : 'border-blue-300/30 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-violet-900/20'
    }`}>
      <div className="absolute -right-10 -top-14 h-36 w-36 rounded-full bg-white/10" />
      <div className="absolute -bottom-16 right-24 h-28 w-28 rounded-full bg-white/5" />
      <div className="relative flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 shadow-inner backdrop-blur-sm">
          {isError ? <X size={25} /> : isAccepted ? <CheckCircle2 size={27} /> : <Sparkles size={24} />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[.22em] text-white/70">
            {isError ? 'Action impossible' : isAccepted ? 'Réservation confirmée' : 'Mise à jour effectuée'}
          </p>
          <p className="mt-1 text-base font-semibold leading-6">{message}</p>
          {isAccepted && <p className="mt-1 text-sm text-blue-100">Elle est maintenant visible dans « Locations en cours ».</p>}
        </div>
        <button onClick={onClose} className="rounded-xl p-2 text-white/70 transition hover:bg-white/10 hover:text-white" aria-label="Fermer la notification">
          <X size={19} />
        </button>
      </div>
    </div>
  )
}

type ManualReservationData = {
  clientName: string
  phone: string
  vehicleId: string
  startDate: string
  endDate: string
  days: number
  totalPrice: number
  paymentMethod: string
}

function ManualReservationModal({
  vehicles,
  onClose,
  onSave,
}: {
  vehicles: AdminVehicle[]
  onClose: () => void
  onSave: (data: ManualReservationData) => Promise<void>
}) {
  const [form, setForm] = useState({
    clientName: '',
    phone: '',
    vehicleId: '',
    startDate: new Date().toISOString().slice(0, 10),
    days: 1,
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === form.vehicleId)
  const endDate = addDays(form.startDate, form.days)
  const totalPrice = (selectedVehicle?.pricePerDay || 0) * form.days

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSave({ ...form, endDate, totalPrice, paymentMethod: '' })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Impossible d’ajouter la réservation.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title="Réservation reçue par téléphone" onClose={onClose}>
      <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
        <Field label="Nom complet du client *">
          <input required minLength={2} value={form.clientName} onChange={(event) => setForm((value) => ({ ...value, clientName: event.target.value }))} className="w-full text-slate-900" />
        </Field>
        <Field label="Téléphone *">
          <input required minLength={6} type="tel" value={form.phone} onChange={(event) => setForm((value) => ({ ...value, phone: event.target.value }))} className="w-full text-slate-900" />
        </Field>
        <Field label="Véhicule *">
          <select required value={form.vehicleId} onChange={(event) => setForm((value) => ({ ...value, vehicleId: event.target.value }))} className="w-full text-slate-900">
            <option value="">Sélectionnez un véhicule</option>
            {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.brand} {vehicle.model} — {vehicle.status}</option>)}
          </select>
        </Field>
        <Field label="Date de départ *">
          <input required type="date" value={form.startDate} onChange={(event) => setForm((value) => ({ ...value, startDate: event.target.value }))} className="w-full text-slate-900" />
        </Field>
        <Field label="Nombre de jours *">
          <input required min="1" step="1" type="number" value={form.days} onChange={(event) => setForm((value) => ({ ...value, days: Number(event.target.value) }))} className="w-full text-slate-900" />
        </Field>
        <div className="rounded-2xl bg-blue-50 p-4 text-sm text-blue-950">
          <p>Retour prévu : <strong>{endDate || '—'}</strong></p>
          <p className="mt-2">Total estimé : <strong>{totalPrice.toLocaleString()} DA</strong></p>
        </div>
        {error && <p className="sm:col-span-2 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
        <button disabled={saving} className="btn-primary sm:col-span-2 disabled:opacity-60">
          {saving ? 'Enregistrement…' : 'Ajouter la réservation'}
        </button>
      </form>
    </Modal>
  )
}

export function StartRentalModal({
  reservation,
  onClose,
  onSubmit,
}: {
  reservation: Reservation
  onClose: () => void
  onSubmit: (input: StartRentalInput) => Promise<void>
}) {
  const [form, setForm] = useState<StartRentalInput>({
    startMileage: 0,
    actualStartDate: new Date().toISOString().slice(0, 10),
    actualStartTime: new Date().toTimeString().slice(0, 5),
    rentalPrice: reservation.totalPrice,
    amountPaid: 0,
    deposit: 0,
    fuelStart: 'Plein',
    departureCondition: 'Bon état',
    notes: '',
  })
  const [error, setError] = useState('')
  const change = (key: keyof StartRentalInput, value: string | number) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      await onSubmit(form)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Erreur')
    }
  }

  return (
    <Modal title="Client a récupéré le véhicule" onClose={onClose}>
      <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
        <Field label="Kilométrage départ *"><input required min="0" type="number" value={form.startMileage} onChange={(event) => change('startMileage', +event.target.value)} className="w-full text-slate-900" /></Field>
        <Field label="Montant location *"><input required min="0" type="number" value={form.rentalPrice} onChange={(event) => change('rentalPrice', +event.target.value)} className="w-full text-slate-900" /></Field>
        <Field label="Date réelle départ *"><input required type="date" value={form.actualStartDate} onChange={(event) => change('actualStartDate', event.target.value)} className="w-full text-slate-900" /></Field>
        <Field label="Heure départ *"><input required type="time" value={form.actualStartTime} onChange={(event) => change('actualStartTime', event.target.value)} className="w-full text-slate-900" /></Field>
        <Field label="Montant payé"><input min="0" type="number" value={form.amountPaid} onChange={(event) => change('amountPaid', +event.target.value)} className="w-full text-slate-900" /></Field>
        <Field label="Reste à payer"><input readOnly value={Math.max(0, form.rentalPrice - form.amountPaid)} className="w-full bg-slate-100 text-slate-900" /></Field>
        <Field label="Caution"><input min="0" type="number" value={form.deposit} onChange={(event) => change('deposit', +event.target.value)} className="w-full text-slate-900" /></Field>
        <Field label="Carburant départ"><select value={form.fuelStart} onChange={(event) => change('fuelStart', event.target.value)} className="w-full text-slate-900">{['Plein', '3/4', '1/2', '1/4', 'Réserve'].map((value) => <option key={value}>{value}</option>)}</select></Field>
        <Field label="État au départ"><input required value={form.departureCondition} onChange={(event) => change('departureCondition', event.target.value)} className="w-full text-slate-900" /></Field>
        <Field label="Notes"><textarea value={form.notes} onChange={(event) => change('notes', event.target.value)} className="w-full text-slate-900" /></Field>
        {error && <p className="sm:col-span-2 text-sm text-rose-600">{error}</p>}
        <button className="btn-primary sm:col-span-2">Confirmer le départ</button>
      </form>
    </Modal>
  )
}
