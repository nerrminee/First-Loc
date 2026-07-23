import { useState, type FormEvent } from 'react'
import { Gauge, Plus, Wrench } from 'lucide-react'
import { useRentalData } from '../../context/RentalDataContext'
import type { AdminVehicle, MaintenanceRecord, MaintenanceType } from '../../types/rental'
import { Empty, Field, Modal, PageHeader, StatusBadge } from '../../components/admin/AdminUI'

const maintenanceTypes: MaintenanceType[] = [
  'Vidange',
  'Filtre à huile',
  'Filtre à air',
  'Filtre habitacle',
  'Pneus',
  'Freins',
  'Batterie',
  'Révision',
  'Assurance',
  'Contrôle technique',
  'Autre',
]

export default function DashboardMaintenancePage() {
  const { vehicles, maintenance, registerMaintenance, upsertVehicle } = useRentalData()
  const [maintenanceOpen, setMaintenanceOpen] = useState(false)
  const [mileageVehicle, setMileageVehicle] = useState<AdminVehicle | null>(null)
  const [message, setMessage] = useState('')

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Suivi technique"
        title="Entretien & vidange"
        action={
          <button onClick={() => setMaintenanceOpen(true)} className="btn-primary">
            <Plus size={17} /> Ajouter un entretien
          </button>
        }
      />

      {message && <div className="rounded-2xl bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">{message}</div>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {vehicles.map((vehicle) => {
          const remaining = vehicle.nextOilChangeMileage - vehicle.currentMileage
          const tone = remaining < 500 ? 'red' : remaining <= 2000 ? 'amber' : 'green'
          return (
            <article key={vehicle.id} className="rounded-3xl bg-white p-5 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-950">{vehicle.brand} {vehicle.model}</p>
                  <p className="text-xs text-slate-500">{vehicle.registration} · {vehicle.year}</p>
                </div>
                <StatusBadge tone={tone}>{remaining < 0 ? 'Dépassée' : remaining < 500 ? 'Urgent' : remaining <= 2000 ? 'Bientôt' : 'OK'}</StatusBadge>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">KM actuel</p>
                  <p className="mt-1 font-bold text-slate-950">{vehicle.currentMileage.toLocaleString()} km</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Intervalle</p>
                  <p className="mt-1 font-bold text-slate-950">{vehicle.oilChangeInterval.toLocaleString()} km</p>
                </div>
              </div>
              <p className={`mt-5 text-2xl font-black ${tone === 'red' ? 'text-rose-600' : tone === 'amber' ? 'text-orange-600' : 'text-emerald-600'}`}>
                {remaining >= 0 ? `${remaining.toLocaleString()} km` : `-${Math.abs(remaining).toLocaleString()} km`}
              </p>
              <p className="mt-1 text-xs text-slate-500">avant prochaine vidange · {vehicle.nextOilChangeMileage.toLocaleString()} km</p>
              <button onClick={() => setMileageVehicle(vehicle)} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200">
                <Gauge size={16} /> Modifier le kilométrage
              </button>
            </article>
          )
        })}
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-xl font-bold text-slate-950">Historique des entretiens</h2>
          <p className="mt-1 text-sm text-slate-500">Chaque entretien ajouté reste conservé.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                {['Date', 'Véhicule', 'Type', 'Kilométrage', 'Montant', 'Garage', 'Notes', 'Prochaine échéance'].map((heading) => (
                  <th key={heading} className="px-5 py-4 text-xs font-bold uppercase text-slate-500">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...maintenance].sort((a, b) => b.date.localeCompare(a.date)).map((record) => {
                const vehicle = vehicles.find((candidate) => candidate.id === record.vehicleId)
                return (
                  <tr key={record.id} className="border-t border-slate-100 text-sm text-slate-700">
                    <td className="px-5 py-4">{record.date}</td>
                    <td className="px-5 py-4 font-semibold text-slate-950">{vehicle?.brand} {vehicle?.model}</td>
                    <td className="px-5 py-4">{record.type}</td>
                    <td className="px-5 py-4">{record.mileage.toLocaleString()} km</td>
                    <td className="px-5 py-4">{record.cost.toLocaleString()} DA</td>
                    <td className="px-5 py-4">{record.garage || '—'}</td>
                    <td className="px-5 py-4">{record.notes || '—'}</td>
                    <td className="px-5 py-4">{record.nextMaintenanceMileage ? `${record.nextMaintenanceMileage.toLocaleString()} km` : record.nextMaintenanceDate || '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {!maintenance.length && <Empty>Aucun entretien enregistré.</Empty>}
      </div>

      {maintenanceOpen && (
        <MaintenanceModal
          vehicles={vehicles}
          onClose={() => setMaintenanceOpen(false)}
          onSave={async (data) => {
            await registerMaintenance(data)
            setMaintenanceOpen(false)
            setMessage('Entretien enregistré et kilométrage du véhicule mis à jour.')
          }}
        />
      )}

      {mileageVehicle && (
        <MileageModal
          vehicle={mileageVehicle}
          onClose={() => setMileageVehicle(null)}
          onSave={async (mileage) => {
            await upsertVehicle({ ...mileageVehicle, currentMileage: mileage })
            setMileageVehicle(null)
            setMessage(`Kilométrage de ${mileageVehicle.brand} ${mileageVehicle.model} mis à jour.`)
          }}
        />
      )}
    </div>
  )
}

function MileageModal({
  vehicle,
  onClose,
  onSave,
}: {
  vehicle: AdminVehicle
  onClose: () => void
  onSave: (mileage: number) => Promise<void>
}) {
  const [mileage, setMileage] = useState(vehicle.currentMileage)
  const [error, setError] = useState('')

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    if (mileage < 0) return setError('Le kilométrage ne peut pas être négatif.')
    try {
      await onSave(mileage)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Impossible de modifier le kilométrage.')
    }
  }

  return (
    <Modal title={`Kilométrage · ${vehicle.brand} ${vehicle.model}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-5">
        <div className="rounded-2xl bg-blue-50 p-4 text-sm text-blue-900">
          Kilométrage enregistré : <strong>{vehicle.currentMileage.toLocaleString()} km</strong>
        </div>
        <Field label="Nouveau kilométrage">
          <input autoFocus required min="0" type="number" value={mileage} onChange={(event) => setMileage(+event.target.value)} className="w-full text-white" />
        </Field>
        {error && <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
        <button className="btn-primary w-full"><Gauge size={17} /> Enregistrer le kilométrage</button>
      </form>
    </Modal>
  )
}

function MaintenanceModal({
  vehicles,
  onClose,
  onSave,
}: {
  vehicles: AdminVehicle[]
  onClose: () => void
  onSave: (data: Omit<MaintenanceRecord, 'id' | 'createdAt'>) => Promise<void>
}) {
  const firstVehicle = vehicles[0]
  const [form, setForm] = useState({
    vehicleId: firstVehicle?.id || '',
    type: 'Vidange' as MaintenanceType,
    date: new Date().toISOString().slice(0, 10),
    mileage: firstVehicle?.currentMileage || 0,
    cost: 0,
    garage: '',
    notes: '',
    nextMaintenanceMileage: (firstVehicle?.currentMileage || 0) + (firstVehicle?.oilChangeInterval || 10000),
    nextMaintenanceDate: '',
  })
  const [error, setError] = useState('')
  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === form.vehicleId)
  const set = (key: keyof typeof form, value: string | number) => setForm((current) => ({ ...current, [key]: value }))

  const selectVehicle = (id: string) => {
    const vehicle = vehicles.find((candidate) => candidate.id === id)
    const mileage = vehicle?.currentMileage || 0
    setForm((current) => ({
      ...current,
      vehicleId: id,
      mileage,
      nextMaintenanceMileage: mileage + (vehicle?.oilChangeInterval || 10000),
    }))
  }

  const changeMileage = (mileage: number) => {
    setForm((current) => ({
      ...current,
      mileage,
      nextMaintenanceMileage: mileage + (selectedVehicle?.oilChangeInterval || 10000),
    }))
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    try {
      await onSave(form)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Impossible d’enregistrer l’entretien.')
    }
  }

  return (
    <Modal title="Ajouter un entretien" onClose={onClose}>
      <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
        <Field label="Véhicule">
          <select required value={form.vehicleId} onChange={(event) => selectVehicle(event.target.value)} className="w-full text-white">
            {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.brand} {vehicle.model} · {vehicle.registration}</option>)}
          </select>
        </Field>
        <Field label="Type d’entretien">
          <select value={form.type} onChange={(event) => set('type', event.target.value)} className="w-full text-white">
            {maintenanceTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
        </Field>
        <Field label="Date"><input required type="date" value={form.date} onChange={(event) => set('date', event.target.value)} className="w-full text-white" /></Field>
        <Field label="Kilométrage actuel"><input required min="0" type="number" value={form.mileage} onChange={(event) => changeMileage(+event.target.value)} className="w-full text-white" /></Field>
        <Field label="Montant"><input min="0" type="number" value={form.cost} onChange={(event) => set('cost', +event.target.value)} className="w-full text-white" /></Field>
        <Field label="Garage"><input value={form.garage} onChange={(event) => set('garage', event.target.value)} className="w-full text-white" /></Field>
        <Field label="Prochaine échéance KM"><input min="0" type="number" value={form.nextMaintenanceMileage} onChange={(event) => set('nextMaintenanceMileage', +event.target.value)} className="w-full text-white" /></Field>
        <Field label="Prochaine échéance date"><input type="date" value={form.nextMaintenanceDate} onChange={(event) => set('nextMaintenanceDate', event.target.value)} className="w-full text-white" /></Field>
        <Field label="Notes"><textarea value={form.notes} onChange={(event) => set('notes', event.target.value)} className="w-full text-white" /></Field>
        {error && <p className="sm:col-span-2 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
        <button className="btn-primary sm:col-span-2"><Wrench size={17} /> Enregistrer l’entretien</button>
      </form>
    </Modal>
  )
}
