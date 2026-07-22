import { Link } from 'react-router-dom'
import { ArrowRight, CalendarCheck, Check, ChevronRight, Clock3, Gauge, MapPin, ShieldCheck, Sparkles, Star, Users } from 'lucide-react'
import { demoVehicles } from '../../data/vehicles'
import heroCar from '../../assets/pic1.jpg'
import detailCar from '../../assets/pic2.jpg'
import logo from '../../assets/logo.png'

const benefits = [
  { icon: ShieldCheck, title: 'Conduisez en confiance', text: 'Des véhicules contrôlés et parfaitement entretenus.' },
  { icon: Clock3, title: 'Service réactif', text: 'Une équipe disponible pour vous accompagner à chaque étape.' },
  { icon: MapPin, title: 'Livraison flexible', text: 'À l’aéroport ou au point de rendez-vous de votre choix.' },
]

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <section className="hero-grid relative min-h-[calc(100vh-80px)]">
        <img src={heroCar} alt="Voiture premium First Loc DZ" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#050713_5%,rgba(5,7,19,.94)_40%,rgba(5,7,19,.26)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#050713_0%,transparent_45%)]" />
        <div className="container relative flex min-h-[calc(100vh-80px)] items-center py-20">
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.22em] text-violet-200">
              <Sparkles size={14} /> L'excellence sur chaque route
            </div>
            <h1 className="font-display text-5xl font-black uppercase leading-[.94] tracking-[-.045em] sm:text-7xl lg:text-[6.6rem]">
              Votre route.<br /><span className="text-gradient">Votre style.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">Une sélection de véhicules récents, un service personnalisé et la liberté de partir où vous voulez en Algérie.</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/vehicules" className="btn-primary group">Découvrir la flotte <ArrowRight size={18} className="transition group-hover:translate-x-1" /></Link>
              <Link to="/reservation" className="btn-secondary">Réserver maintenant</Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-9 gap-y-4 border-t border-white/10 pt-7 text-sm text-slate-400">
              <span className="flex items-center gap-2"><Check size={16} className="text-blue-400" /> Prix transparents</span>
              <span className="flex items-center gap-2"><Check size={16} className="text-blue-400" /> Flotte récente</span>
              <span className="flex items-center gap-2"><Check size={16} className="text-blue-400" /> Assistance dédiée</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 right-8 hidden rounded-2xl border border-white/10 bg-black/35 px-5 py-4 backdrop-blur-md lg:block">
          <p className="text-xs uppercase tracking-[.2em] text-slate-400">À partir de</p><p className="mt-1 text-2xl font-bold">6 500 <span className="text-sm text-violet-300">DZD / jour</span></p>
        </div>
      </section>

      <section className="relative bg-ink py-24">
        <div className="glow glow-one" />
        <div className="container relative">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div><p className="eyebrow">Notre sélection</p><h2 className="section-title">Choisissez votre<br /><span className="text-gradient">prochaine expérience.</span></h2></div>
            <Link to="/vehicules" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white">Voir toute la flotte <ArrowRight size={17} /></Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {demoVehicles.map((car, index) => (
              <article key={car.id} className="vehicle-card group">
                <div className="relative h-56 overflow-hidden">
                  <img src={car.photo_principale} alt={`${car.marque} ${car.modele}`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090b19] via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[11px] font-semibold backdrop-blur-md">{car.statut}</span>
                  <span className="absolute right-4 top-4 text-xs font-bold text-violet-200">0{index + 1}</span>
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[.2em] text-slate-500">{car.marque} · {car.annee}</p>
                  <h3 className="mt-2 text-xl font-bold">{car.modele}</h3>
                  <div className="mt-4 flex gap-4 text-xs text-slate-400"><span className="flex gap-1"><Gauge size={15} />{car.boite}</span><span className="flex gap-1"><Users size={15} />{car.places} places</span></div>
                  <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-4">
                    <p><strong className="text-xl">{car.prix_par_jour.toLocaleString()}</strong> <span className="text-xs text-slate-500">DZD/j</span></p>
                    <Link to={`/vehicules/${car.id}`} aria-label={`Voir ${car.modele}`} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition hover:border-violet-400 hover:bg-violet-500"><ChevronRight size={18} /></Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#080a17] py-24">
        <div className="container grid gap-14 lg:grid-cols-2 lg:items-center">
          <div className="relative min-h-[560px] overflow-hidden rounded-[2rem]">
            <img src={detailCar} alt="Mercedes AMG bleue" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080a17]/90 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 rounded-2xl border border-white/10 bg-black/45 p-5 backdrop-blur-xl">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600"><Star size={21} fill="currentColor" /></div>
              <div><p className="font-semibold">Une expérience premium</p><p className="text-sm text-slate-400">Du premier contact jusqu'au retour des clés.</p></div>
            </div>
          </div>
          <div>
            <p className="eyebrow">Pourquoi First Loc DZ</p>
            <h2 className="section-title">Bien plus qu'une<br /><span className="text-gradient">simple location.</span></h2>
            <p className="mt-6 max-w-xl leading-7 text-slate-400">Nous avons imaginé un service fluide, humain et exigeant. Votre temps compte, votre confort aussi.</p>
            <div className="mt-10 space-y-4">
              {benefits.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-5 rounded-2xl border border-white/8 bg-white/[.025] p-5 transition hover:border-violet-400/30 hover:bg-white/[.045]">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-400"><Icon size={21} /></div>
                  <div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-400">{text}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-ink py-24 text-center">
        <div className="glow glow-two" />
        <div className="container relative">
          <p className="eyebrow">Simple & rapide</p><h2 className="section-title">Votre voiture en <span className="text-gradient">3 étapes.</span></h2>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[['01', CalendarCheck, 'Choisissez', 'Sélectionnez votre véhicule et vos dates.'], ['02', ShieldCheck, 'Confirmez', 'Notre équipe valide rapidement votre demande.'], ['03', Gauge, 'Prenez la route', 'Récupérez vos clés et profitez du trajet.']].map(([n, Icon, title, text]) => {
              const StepIcon = Icon as typeof CalendarCheck
              return <div key={String(n)} className="step-card"><span className="step-number">{String(n)}</span><StepIcon className="mx-auto text-violet-400" size={28} /><h3 className="mt-5 text-xl font-bold">{String(title)}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{String(text)}</p></div>
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#080a17] py-20">
        <div className="container overflow-hidden rounded-[2rem] border border-violet-400/20 bg-[linear-gradient(120deg,rgba(37,99,235,.2),rgba(124,58,237,.22),rgba(5,7,19,.4))] p-8 md:p-14">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-5"><img src={logo} alt="First Loc DZ" className="hidden h-24 w-28 rounded-2xl object-cover mix-blend-screen sm:block" /><div><p className="eyebrow">Prêt à partir ?</p><h2 className="text-3xl font-black tracking-tight md:text-4xl">La route vous attend.</h2></div></div>
            <Link to="/reservation" className="btn-primary whitespace-nowrap">Réserver mon véhicule <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#050713] py-10">
        <div className="container flex flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left"><p className="text-sm text-slate-500">© 2026 First Loc DZ. Tous droits réservés.</p><p className="text-xs uppercase tracking-[.24em] text-slate-600">Votre route, notre priorité.</p></div>
      </footer>
    </main>
  )
}
