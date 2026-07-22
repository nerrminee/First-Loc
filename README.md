# 5 FIRST LOC DZ

Site de location de voitures pour **5 FIRST LOC DZ**.

## Objectif du projet

- Site public pour consulter les véhicules et envoyer une demande de réservation.
- Dashboard sécurisé pour les gestionnaires et administrateurs.
- Gestion des véhicules, réservations, clients, paiements, entretiens et dépenses.

## Technologies

- React
- Vite
- TypeScript
- Tailwind CSS
- Supabase
- React Router
- Lucide React
- React Hook Form + Zod
- Recharts

## Installation

1. Copier `.env.example` en `.env`
2. Remplir `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
3. Exécuter `npm install`
4. Lancer le développement avec `npm run dev`

## Commandes

- `npm run dev` - démarre le serveur de développement
- `npm run build` - compile le projet après validation TypeScript
- `npm run preview` - prévisualise la build
- `npm run lint` - exécute OXLint
- `npm run typecheck` - vérifie les types TypeScript

## Supabase

1. Créer un projet Supabase.
2. Ajouter les variables d environnement dans `.env`.
3. Exécuter `supabase db push` ou importer les scripts SQL du dossier `supabase/`.
4. Activer Row Level Security pour les tables.

## Structure

- `src/` - application frontend
- `src/pages/` - pages publiques et dashboard
- `src/components/` - composants réutilisables
- `src/lib/` - client Supabase
- `src/data/` - données de démonstration
- `src/types/` - types TypeScript
- `supabase/` - schéma SQL, politiques et données de démonstration

## Déploiement Vercel

- Ajouter le projet dans Vercel
- Configurer les variables d environnement dans Vercel
- Déployer la branche principale
- S assurer que `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont définis

## Création du premier administrateur

1. Créer un utilisateur Supabase dans la table `profiles`.
2. Donner le rôle `Administrateur`.
3. Se connecter via la page de connexion.
"# First-Loc" 
