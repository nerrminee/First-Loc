import { useMemo, useState, type FormEvent } from 'react'
import { CalendarDays, Car, MapPin, Pencil, Plus, Save, Trash2, User, X } from 'lucide-react'
import { demoVehicles } from '../../data/vehicles'

type RentalStatus = 'Réservée' | 'En cours' | 'Terminée' | 'Annulée'
type Rental = {
  id: string
  vehicleId: string
  clientName: string
  phone: string
  idNumber: string
  licenseNumber: string
  startDate: string
  endDate: string
  pickupLocation: string
  returnLocation: string
  dailyPrice: number
  deposit: number
  status: RentalStatus
  notes: string
}

const STORAGE_KEY = 'firstloc_rentals'
const emptyRental: Omit<Rental, 'id'> = {
  vehicleId: '', clientName: '', phone: '', idNumber: '', licenseNumber: '', startDate: '', endDate: '',
  pickupLocation: '', returnLocation: '', dailyPrice: 0, deposit: 0, status: 'Réservée', notes: '',
}

const loadRentals = (): Rental[] => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Rental[] } catch { return [] }
}

const statusStyle: Record<RentalStatus, string> = {
  'Réservée': 'bg-amber-100 text-amber-800', 'En cours': 'bg-blue-100 text-blue-800',
  'Terminée': 'bg-emerald-100 text-emerald-800', 'Annulée': 'bg-rose-100 text-rose-800',
}

export default function DashboardReservationsPage() {
  const [rentals, setRentals] = useState<Rental[]>(loadRentals)
  const [form, setForm] = useState(emptyRental)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const selectedVehicle = demoVehicles.find((vehicle) => vehicle.id === form.vehicleId)
  const days = useMemo(() => {
    if (!form.startDate || !form.endDate) return 0
    return Math.max(1, Math.ceil((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86400000))
  }, [form.startDate, form.endDate])
  const total = days * Number(form.dailyPrice || 0)

  const update = (field: keyof typeof form, value: string | number) => setForm((current) => ({ ...current, [field]: value }))
  const persist = (next: Rental[]) => { setRentals(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) }
  const reset = () => { setForm(emptyRental); setEditingId(null); setShowForm(false) }

  const selectVehicle = (id: string) => {
    const vehicle = demoVehicles.find((item) => item.id === id)
    setForm((current) => ({ ...current, vehicleId: id, dailyPrice: vehicle?.prix_par_jour ?? 0, deposit: vehicle?.caution ?? 0 }))
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const record: Rental = { ...form, id: editingId ?? `LOC-${Date.now()}` }
    persist(editingId ? rentals.map((rental) => rental.id === editingId ? record : rental) : [record, ...rentals])
    reset()
  }

  const edit = (rental: Rental) => { const { id, ...values } = rental; setForm(values); setEditingId(id); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const remove = (id: string) => { if (window.confirm('Supprimer cette location ?')) persist(rentals.filter((rental) => rental.id !== id)) }

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-sm uppercase tracking-[0.3em] text-brand">Locations</p><h2 className="mt-2 text-3xl font-semibold text-slate-950">Locations par véhicule</h2><p className="mt-2 text-sm text-slate-500">Enregistrez le client et toutes les informations de sa location.</p></div>
          <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white"><Plus size={18} /> Nouvelle location</button>
        </div>
      </div>

      {showForm && <form onSubmit={submit} className="rounded-[2rem] bg-white p-6 shadow-soft sm:p-8">
        <div className="mb-7 flex items-center justify-between"><div><p className="text-sm uppercase tracking-[.25em] text-brand">{editingId ? 'Modification' : 'Nouvelle fiche'}</p><h3 className="mt-2 text-2xl font-semibold text-slate-950">Client et location</h3></div><button type="button" onClick={reset} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X /></button></div>
        <div className="grid gap-8 xl:grid-cols-3">
          <fieldset className="space-y-4"><legend className="mb-4 flex items-center gap-2 font-semibold text-slate-900"><User size={19} className="text-brand" /> Informations du client</legend>
            <Field label="Nom et prénom *"><input required value={form.clientName} onChange={(e) => update('clientName', e.target.value)} className="w-full" /></Field>
            <Field label="Téléphone *"><input required type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} className="w-full" /></Field>
            <Field label="N° carte d’identité"><input value={form.idNumber} onChange={(e) => update('idNumber', e.target.value)} className="w-full" /></Field>
            <Field label="N° permis de conduire *"><input required value={form.licenseNumber} onChange={(e) => update('licenseNumber', e.target.value)} className="w-full" /></Field>
          </fieldset>
          <fieldset className="space-y-4"><legend className="mb-4 flex items-center gap-2 font-semibold text-slate-900"><Car size={19} className="text-brand" /> Véhicule et période</legend>
            <Field label="Véhicule *"><select required value={form.vehicleId} onChange={(e) => selectVehicle(e.target.value)} className="w-full"><option value="">Choisir un véhicule</option>{demoVehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.marque} {vehicle.modele} — {vehicle.immatriculation}</option>)}</select></Field>
            <div className="grid grid-cols-2 gap-3"><Field label="Date de départ *"><input required type="date" value={form.startDate} onChange={(e) => update('startDate', e.target.value)} className="w-full" /></Field><Field label="Date de retour *"><input required type="date" min={form.startDate} value={form.endDate} onChange={(e) => update('endDate', e.target.value)} className="w-full" /></Field></div>
            <div className="grid grid-cols-2 gap-3"><Field label="Prix / jour"><input required min="0" type="number" value={form.dailyPrice} onChange={(e) => update('dailyPrice', Number(e.target.value))} className="w-full" /></Field><Field label="Caution"><input min="0" type="number" value={form.deposit} onChange={(e) => update('deposit', Number(e.target.value))} className="w-full" /></Field></div>
            <Field label="Statut"><select value={form.status} onChange={(e) => update('status', e.target.value)} className="w-full">{(['Réservée', 'En cours', 'Terminée', 'Annulée'] as RentalStatus[]).map((status) => <option key={status}>{status}</option>)}</select></Field>
          </fieldset>
          <fieldset className="space-y-4"><legend className="mb-4 flex items-center gap-2 font-semibold text-slate-900"><MapPin size={19} className="text-brand" /> Lieux et détails</legend>
            <Field label="Lieu de départ *"><input required value={form.pickupLocation} onChange={(e) => update('pickupLocation', e.target.value)} className="w-full" /></Field>
            <Field label="Lieu de retour *"><input required value={form.returnLocation} onChange={(e) => update('returnLocation', e.target.value)} className="w-full" /></Field>
            <Field label="Notes"><textarea rows={3} value={form.notes} onChange={(e) => update('notes', e.target.value)} className="w-full" /></Field>
            <div className="rounded-2xl bg-slate-950 p-5 text-white"><p className="text-xs uppercase tracking-[.22em] text-slate-400">Résumé</p><div className="mt-3 flex justify-between text-sm"><span>{days} jour(s)</span><span>{selectedVehicle?.modele ?? 'Aucun véhicule'}</span></div><p className="mt-4 text-2xl font-bold">{total.toLocaleString()} DZD</p><p className="mt-1 text-xs text-slate-400">Caution : {Number(form.deposit).toLocaleString()} DZD</p></div>
          </fieldset>
        </div>
        <div className="mt-8 flex justify-end gap-3"><button type="button" onClick={reset} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm text-slate-600">Annuler</button><button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-brand px-6 py-3 text-sm font-semibold text-white"><Save size={17} /> Enregistrer</button></div>
      </form>}

      <div className="overflow-hidden rounded-[2rem] bg-white shadow-soft">
        <div className="overflow-x-auto"><table className="min-w-[1100px] w-full border-collapse text-left"><thead className="bg-slate-50"><tr>{['Location', 'Véhicule', 'Client', 'Période', 'Lieux', 'Montant', 'Statut', 'Actions'].map((label) => <th key={label} className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</th>)}</tr></thead>
          <tbody>{rentals.map((rental) => { const vehicle = demoVehicles.find((item) => item.id === rental.vehicleId); const rentalDays = Math.max(1, Math.ceil((new Date(rental.endDate).getTime() - new Date(rental.startDate).getTime()) / 86400000)); return <tr key={rental.id} className="border-t border-slate-100 align-top hover:bg-slate-50/60">
            <td className="px-5 py-5 text-sm font-semibold text-slate-700">{rental.id}</td><td className="px-5 py-5"><p className="font-semibold text-slate-950">{vehicle?.marque} {vehicle?.modele}</p><p className="text-xs text-slate-500">{vehicle?.immatriculation}</p></td><td className="px-5 py-5"><p className="font-medium text-slate-900">{rental.clientName}</p><p className="text-xs text-slate-500">{rental.phone} · Permis {rental.licenseNumber}</p></td><td className="px-5 py-5 text-sm text-slate-700"><p className="flex gap-2"><CalendarDays size={15} />{rental.startDate}</p><p className="mt-1 pl-6 text-xs text-slate-500">au {rental.endDate} ({rentalDays} j)</p></td><td className="px-5 py-5 text-sm text-slate-700"><p>{rental.pickupLocation}</p><p className="mt-1 text-xs text-slate-500">→ {rental.returnLocation}</p></td><td className="px-5 py-5"><p className="font-semibold text-slate-900">{(rentalDays * rental.dailyPrice).toLocaleString()} DZD</p><p className="text-xs text-slate-500">+ {rental.deposit.toLocaleString()} caution</p></td><td className="px-5 py-5"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[rental.status]}`}>{rental.status}</span></td><td className="px-5 py-5"><div className="flex gap-2"><button onClick={() => edit(rental)} className="rounded-xl bg-slate-100 p-2 text-slate-600 hover:text-brand" title="Modifier"><Pencil size={16} /></button><button onClick={() => remove(rental.id)} className="rounded-xl bg-rose-50 p-2 text-rose-600" title="Supprimer"><Trash2 size={16} /></button></div></td>
          </tr>})}</tbody></table></div>
        {rentals.length === 0 && <div className="px-6 py-16 text-center"><Car className="mx-auto text-slate-300" size={36} /><p className="mt-3 font-medium text-slate-700">Aucune location enregistrée</p><p className="mt-1 text-sm text-slate-500">Cliquez sur « Nouvelle location » pour ajouter un client à un véhicule.</p></div>}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>{children}</label>
}
