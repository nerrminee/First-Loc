import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { demoVehicles } from '../../data/vehicles'

const reservationSchema = z.object({
  nom: z.string().min(2, 'Le nom est requis.'),
  prenom: z.string().min(2, 'Le prénom est requis.'),
  telephone: z.string().min(6, 'Le téléphone est requis.'),
  email: z.string().email('E-mail invalide.'),
  adresse: z.string().min(5, 'L adresse est requise.'),
  permis_numero: z.string().min(4, 'Le numéro du permis est requis.'),
  permis_date: z.string().min(10, 'La date d obtention du permis est requise.'),
  vehicule_id: z.string().min(1, 'Veuillez sélectionner un véhicule.'),
  date_depart: z.string().min(10, 'La date de départ est requise.'),
  heure_depart: z.string().min(5, 'L heure de départ est requise.'),
  date_retour: z.string().min(10, 'La date de retour est requise.'),
  heure_retour: z.string().min(5, 'L heure de retour est requise.'),
  lieu_depart: z.string().min(3, 'Le lieu de départ est requis.'),
  lieu_retour: z.string().min(3, 'Le lieu de retour est requis.'),
  message: z.string().optional(),
  conditions: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter les conditions de location.' })
  })
})

type ReservationFormValues = z.infer<typeof reservationSchema>

export default function ReservationPage() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ReservationFormValues>({ resolver: zodResolver(reservationSchema) })

  const vehiculeId = watch('vehicule_id')
  const dateDepart = watch('date_depart')
  const dateRetour = watch('date_retour')
  const selectedVehicle = useMemo(() => demoVehicles.find((vehicle) => vehicle.id === vehiculeId), [vehiculeId])

  const jours = useMemo(() => {
    if (!dateDepart || !dateRetour) return 0
    const start = new Date(dateDepart)
    const end = new Date(dateRetour)
    const diff = Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
    return diff || 1
  }, [dateDepart, dateRetour])

  const totalEstime = selectedVehicle ? selectedVehicle.prix_par_jour * jours : 0

  const onSubmit = () => {
    setSubmitted(true)
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
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">E-mail</span>
                <input type="email" {...register('email')} className="w-full" />
                {errors.email && <span className="text-sm text-rose-600">{errors.email.message}</span>}
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-700">Adresse</span>
                <input type="text" {...register('adresse')} className="w-full" />
                {errors.adresse && <span className="text-sm text-rose-600">{errors.adresse.message}</span>}
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Numéro de permis</span>
                <input type="text" {...register('permis_numero')} className="w-full" />
                {errors.permis_numero && <span className="text-sm text-rose-600">{errors.permis_numero.message}</span>}
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Date d obtention du permis</span>
                <input type="date" {...register('permis_date')} className="w-full" />
                {errors.permis_date && <span className="text-sm text-rose-600">{errors.permis_date.message}</span>}
              </label>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Véhicule sélectionné</span>
                <select {...register('vehicule_id')} className="w-full">
                  <option value="">Sélectionnez un véhicule</option>
                  {demoVehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>{vehicle.marque} {vehicle.modele}</option>
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
                <span className="text-sm font-medium text-slate-700">Heure de départ</span>
                <input type="time" {...register('heure_depart')} className="w-full" />
                {errors.heure_depart && <span className="text-sm text-rose-600">{errors.heure_depart.message}</span>}
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Date de retour</span>
                <input type="date" {...register('date_retour')} className="w-full" />
                {errors.date_retour && <span className="text-sm text-rose-600">{errors.date_retour.message}</span>}
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Heure de retour</span>
                <input type="time" {...register('heure_retour')} className="w-full" />
                {errors.heure_retour && <span className="text-sm text-rose-600">{errors.heure_retour.message}</span>}
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Lieu de départ</span>
                <input type="text" {...register('lieu_depart')} className="w-full" />
                {errors.lieu_depart && <span className="text-sm text-rose-600">{errors.lieu_depart.message}</span>}
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Lieu de retour</span>
                <input type="text" {...register('lieu_retour')} className="w-full" />
                {errors.lieu_retour && <span className="text-sm text-rose-600">{errors.lieu_retour.message}</span>}
              </label>
              <label className="md:col-span-2 space-y-2">
                <span className="text-sm font-medium text-slate-700">Message</span>
                <textarea {...register('message')} rows={4} className="w-full" />
              </label>
            </div>

            <label className="flex items-center gap-3">
              <input type="checkbox" {...register('conditions')} className="h-5 w-5 rounded-md border-slate-300 text-brand focus:ring-brand" />
              <span className="text-sm text-slate-700">J accepte les conditions de location.</span>
            </label>
            {errors.conditions && <span className="text-sm text-rose-600">{errors.conditions.message}</span>}

            <button type="submit" className="inline-flex w-full items-center justify-center rounded-2xl bg-brand px-6 py-4 text-white transition hover:bg-brand-dark">
              Envoyer la demande
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
