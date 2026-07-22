import { Link } from 'react-router-dom'
import { ShieldCheck, CalendarDays, Sparkles, MapPin, User } from 'lucide-react'
import { demoVehicles } from '../../data/vehicles'

const benefits = [
  { icon: ShieldCheck, title: 'Tarifs transparents', description: 'Aucun frais caché, prix claire et service premium.' },
  { icon: Sparkles, title: 'Véhicules récents', description: 'Flotte moderne et entretenue pour un trajet confortable.' },
  { icon: CalendarDays, title: 'Réservation rapide', description: 'Réservez en quelques clics et recevez une confirmation rapide.' },
  { icon: MapPin, title: 'Livraison possible', description: 'Livraison à l aéroport ou point de rendez-vous convenu.' }
]

const steps = [
  { title: 'Choisissez votre véhicule', description: 'Parcourez nos modèles disponibles et sélectionnez celui qui vous convient.' },
  { title: 'Envoyez votre demande', description: 'Remplissez le formulaire de réservation en ligne en quelques minutes.' },
  { title: 'Confirmez avec nous', description: 'Notre équipe vous contacte pour préciser les détails et confirmer.' },
  { title: 'Prenez le volant', description: 'Récupérez votre véhicule et démarrez votre voyage en toute sérénité.' }
]

function statusBadge(status: string) {
  const map = {
    Disponible: 'bg-emerald-100 text-emerald-800',
    Réservé: 'bg-amber-100 text-amber-800',
    'En location': 'bg-sky-100 text-sky-800',
    'En entretien': 'bg-orange-100 text-orange-800',
    Indisponible: 'bg-rose-100 text-rose-800'
  }
  return map[status as keyof typeof map] ?? 'bg-slate-100 text-slate-800'
}

export default function HomePage() {
  return (
    <main className="bg-surface text-slate-900">
      <section className="bg-[radial-gradient(circle_at_top,_rgba(15,76,129,0.15),_transparent_40%)]">
        <div className="container mx-auto py-12 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-8">
              <p className="inline-flex items-center gap-3 rounded-full bg-brand-light px-4 py-2 text-sm font-semibold text-brand">
                5 FIRST LOC DZ • Votre route, notre priorité.
              </p>
              <div className="space-y-6">
                <h1 className="text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                  Louez des voitures premium avec confiance.
                </h1>
                <p className="max-w-2xl text-lg text-slate-600">
                  Flotte récente, service personnalisé et réservations en ligne faciles pour vos déplacements en Algérie.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/vehicules" className="rounded-2xl bg-brand px-6 py-3 text-white transition hover:bg-brand-dark">
                  Voir nos véhicules
                </Link>
                <Link to="/reservation" className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-slate-900 transition hover:bg-slate-100">
                  Réserver maintenant
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-soft">
              <img src="/assets/hero-car.jpg" alt="Véhicule de location" className="h-full min-h-[340px] w-full rounded-[1.75rem] object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-brand">Qui sommes-nous</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">Une agence de location de voitures dédiée à votre confort.</h2>
            <p className="mt-4 max-w-2xl text-slate-600">
              5 FIRST LOC DZ offre une expérience premium pour les particuliers et les professionnels. Nous proposons des véhicules récents, des tarifs transparents et un service de qualité.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <h3 className="text-xl font-semibold text-slate-950">Assistance disponible</h3>
              <p className="mt-3 text-slate-600">Une équipe dédiée pour répondre à toutes vos demandes à toute heure.</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <h3 className="text-xl font-semibold text-slate-950">Livraison flexible</h3>
              <p className="mt-3 text-slate-600">Livraison à l aéroport ou au point de rendez-vous que vous choisissez.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-16">
        <div className="space-y-6 text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-brand">Nos véhicules</p>
          <h2 className="text-3xl font-semibold text-slate-950">Découvrez nos modèles populaires</h2>
          <p className="mx-auto max-w-2xl text-slate-600">Sélectionnez un véhicule adapté à votre trajet et réservez en ligne.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {demoVehicles.map((vehicle) => (
            <article key={vehicle.id} className="overflow-hidden rounded-[2rem] bg-white shadow-soft">
              <img src={vehicle.photo_principale} alt={vehicle.modele} className="h-56 w-full object-cover" />
              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusBadge(vehicle.statut)}`}>
                    {vehicle.statut}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">{vehicle.prix_par_jour} DZD / jour</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">{vehicle.marque} {vehicle.modele}</h3>
                  <p className="text-sm text-slate-600">{vehicle.version} • {vehicle.annee}</p>
                </div>
                <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                  <div>{vehicle.boite}</div>
                  <div>{vehicle.carburant}</div>
                  <div>{vehicle.places} places</div>
                  <div>{vehicle.couleur}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to={`/vehicules/${vehicle.id}`} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100">
                    Voir les détails
                  </Link>
                  <Link to="/reservation" className="rounded-full bg-brand px-4 py-2 text-sm text-white transition hover:bg-brand-dark">
                    Réserver
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto py-16">
        <div className="space-y-6 text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-brand">Comment ça marche</p>
          <h2 className="text-3xl font-semibold text-slate-950">4 étapes simples pour louer</h2>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          {steps.map((step) => (
            <article key={step.title} className="rounded-[2rem] bg-white p-8 shadow-soft">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white">
                <User size={24} />
              </div>
              <h3 className="text-xl font-semibold text-slate-950">{step.title}</h3>
              <p className="mt-3 text-slate-600">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-brand">Contact</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">Contactez-nous pour une réservation sur mesure</h2>
            <p className="mt-4 max-w-xl text-slate-600">Appelez-nous, écrivez-nous ou envoyez une demande via le formulaire de réservation. Nous répondons rapidement.</p>
          </div>
          <div className="rounded-[2rem] bg-brand px-8 py-10 text-white shadow-soft">
            <p className="text-sm uppercase tracking-[0.28em] text-brand-light">5 FIRST LOC DZ</p>
            <p className="mt-6 text-2xl font-semibold">+213 555 123 456</p>
            <p className="mt-4 text-slate-100">contact@5firstlocdz.com</p>
            <p className="mt-4 text-slate-100">Alger, Algérie</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50 py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <p className="text-sm font-semibold text-slate-900">5 FIRST LOC DZ</p>
            <p className="text-sm text-slate-600">Votre route, notre priorité.</p>
          </div>
          <p className="text-sm text-slate-500">© 2026 5 FIRST LOC DZ. Tous droits réservés.</p>
        </div>
      </footer>
    </main>
  )
}
