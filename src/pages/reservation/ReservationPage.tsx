import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { demoVehicles } from '../../data/vehicles'
import { useRentalData } from '../../context/RentalDataContext'

const reservationSchema = z.object({
  nom: z.string().min(2, 'Le nom est requis.'),
  prenom: z.string().min(2, 'Le prénom est requis.'),
  telephone: z.string().min(6, 'Le téléphone est requis.'),
  vehicule_id: z.string().min(1, 'Veuillez sélectionner un véhicule.'),
  date_depart: z.string().min(10, 'La date de départ est requise.'),
  nombre_jours: z.number().int('Le nombre de jours doit être un nombre entier.').min(1, 'Veuillez indiquer au moins un jour.'),
  conditions: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter les conditions de location.' })
  })
})

type ReservationFormValues = z.infer<typeof reservationSchema>

const addDays = (date: string, days: number) => {
  if (!date || days < 1) return ''
  const [year, month, day] = date.split('-').map(Number)
  const result = new Date(Date.UTC(year, month - 1, day + days))
  return result.toISOString().slice(0, 10)
}

export default function ReservationPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { submitReservation, vehicles, reservations, rentals } = useRentalData()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: { nombre_jours: 1 }
  })

  const vehiculeId = watch('vehicule_id')
  const dateDepart = watch('date_depart')
  const jours = watch('nombre_jours') || 0
  const dateRetour = useMemo(() => addDays(dateDepart, jours), [dateDepart, jours])
  const selectedVehicle = useMemo(() => demoVehicles.find((vehicle) => vehicle.id === vehiculeId), [vehiculeId])

  const totalEstime = selectedVehicle ? selectedVehicle.prix_par_jour * jours : 0
  const isUnavailable = (vehicleId: string, startDate = dateDepart, endDate = dateRetour) => {
    const vehicle = vehicles.find((item) => item.id === vehicleId)
    if (vehicle && ['Loué', 'Entretien', 'Indisponible'].includes(vehicle.status)) return true
    if (!startDate || !endDate) return false
    const overlaps = (start: string, end: string) => start <= endDate && startDate <= end
    return reservations.some((item) => item.vehicleId === vehicleId && item.status === 'Acceptée' && overlaps(item.startDate, item.endDate)) || rentals.some((item) => item.vehicleId === vehicleId && item.status === 'En cours' && overlaps(item.actualStartDate, item.plannedEndDate))
  }

  const onSubmit = async (values: ReservationFormValues) => {
    setSubmitting(true); setSubmitError('')
    try {
      const endDate = addDays(values.date_depart, values.nombre_jours)
      if (isUnavailable(values.vehicule_id, values.date_depart, endDate)) throw new Error('Ce véhicule n’est pas disponible sur la période sélectionnée.')
      await submitReservation({ clientName: `${values.prenom} ${values.nom}`, phone: values.telephone, vehicleId: values.vehicule_id, startDate: values.date_depart, endDate, days: values.nombre_jours, totalPrice: selectedVehicle ? selectedVehicle.prix_par_jour * values.nombre_jours : 0, paymentMethod: '' })
      setSubmitted(true)
    } catch (error) { setSubmitError(error instanceof Error ? error.message : 'Impossible d’envoyer la demande.') }
    finally { setSubmitting(false) }
  }

  return (
    <main className="bg-surface px-4 py-10 text-slate-900">
      <div className="container mx-auto">
        <div className="mb-10 rounded-[2rem] bg-white p-10 shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-brand">Demande de réservation</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-950">Réservez votre véhicule</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Remplissez le formulaire ci-dessous. Notre équipe validera votre demande et vous contactera.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6 rounded-[2rem] bg-white p-8 shadow-soft">
            <div className="grid gap-6 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Nom</span>
                <input type="text" {...register('nom')} className="w-full" />
                {errors.nom && <span className="text-sm text-rose-600">{errors.nom.message}</span>}
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Prénom</span>
                <input type="text" {...register('prenom')} className="w-full" />
                {errors.prenom && <span className="text-sm text-rose-600">{errors.prenom.message}</span>}
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Téléphone</span>
                <input type="tel" {...register('telephone')} className="w-full" />
                {errors.telephone && <span className="text-sm text-rose-600">{errors.telephone.message}</span>}
              </label>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Véhicule sélectionné</span>
                <select {...register('vehicule_id')} className="w-full">
                  <option value="">Sélectionnez un véhicule</option>
                  {demoVehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id} disabled={isUnavailable(vehicle.id)}>{vehicle.marque} {vehicle.modele}{isUnavailable(vehicle.id) ? ' — Indisponible' : ''}</option>
                  ))}
                </select>
                {errors.vehicule_id && <span className="text-sm text-rose-600">{errors.vehicule_id.message}</span>}
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Date de départ</span>
                <input type="date" {...register('date_depart')} className="w-full" />
                {errors.date_depart && <span className="text-sm text-rose-600">{errors.date_depart.message}</span>}
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Nombre de jours</span>
                <input type="number" min="1" step="1" {...register('nombre_jours', { valueAsNumber: true })} className="w-full" />
                {errors.nombre_jours && <span className="text-sm text-rose-600">{errors.nombre_jours.message}</span>}
              </label>
            </div>

            <label className="flex items-center gap-3">
              <input type="checkbox" {...register('conditions')} className="h-5 w-5 rounded-md border-slate-300 text-brand focus:ring-brand" />
              <span className="text-sm text-slate-700">J accepte les conditions de location.</span>
            </label>
            {errors.conditions && <span className="text-sm text-rose-600">{errors.conditions.message}</span>}

            {submitError && <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{submitError}</p>}
            <button type="submit" disabled={submitting} className="inline-flex w-full items-center justify-center rounded-2xl bg-brand px-6 py-4 text-white transition hover:bg-brand-dark disabled:opacity-60">
              {submitting ? 'Envoi en cours…' : 'Envoyer la demande'}
            </button>
          </div>

          <aside className="space-y-6 rounded-[2rem] bg-white p-8 shadow-soft">
            <div className="rounded-[2rem] bg-brand px-6 py-6 text-white">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-light">Résumé</p>
              <p className="mt-4 text-4xl font-semibold">{jours} jour(s)</p>
              <p className="mt-2 text-sm text-slate-100">Total estimé</p>
              <p className="mt-6 text-3xl font-semibold">{totalEstime.toLocaleString()} DZD</p>
            </div>
            <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold text-slate-900">Détails du véhicule</p>
              {selectedVehicle ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-700">{selectedVehicle.marque} {selectedVehicle.modele}</p>
                  <p className="text-sm text-slate-700">{selectedVehicle.boite} • {selectedVehicle.carburant}</p>
                  <p className="text-sm text-slate-700">Prix journalier : {selectedVehicle.prix_par_jour.toLocaleString()} DZD</p>
                </div>
              ) : (
                <p className="text-sm text-slate-600">Sélectionnez un véhicule pour afficher le total estimé.</p>
              )}
            </div>
          </aside>
        </form>

        {submitted && (
          <div className="mt-10 rounded-[2rem] bg-emerald-50 p-8 text-emerald-900 shadow-soft">
            <h2 className="text-2xl font-semibold">Votre demande de réservation a bien été envoyée.</h2>
            <p className="mt-3 text-slate-700">Notre équipe vous contactera pour confirmation.</p>
          </div>
        )}
      </div>
    </main>
  )
}
