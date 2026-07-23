import type { Vehicle } from '../types'
import clioAlpine from '../assets/clio V.jpeg'
import stepway from '../assets/Stepway (2).jpeg'
import golf85 from '../assets/GOLF 8.5.jpeg'
import poloRline from '../assets/polo (2).jpeg'

export const demoVehicles: Vehicle[] = [
  {
    id: 'vehicule-1',
    marque: 'Renault',
    modele: 'Clio 5 Alpine',
    version: 'Alpine E-Tech',
    annee: 2025,
    immatriculation: 'WW-895-SE',
    couleur: 'Noir',
    places: 5,
    carburant: 'Essence',
    boite: 'Manuelle',
    kilometrage: 8200,
    prix_par_jour: 12000,
    caution: 15000,
    statut: 'Disponible',
    prochain_entretien: '2025-03-15',
    notes: 'Clio 5 Alpine 2025. Vidange tous les 10 000 km.',
    photo_principale: clioAlpine,
    galerie: [clioAlpine, clioAlpine, clioAlpine]
  },
  {
    id: 'vehicule-2',
    marque: 'Dacia',
    modele: 'Sandero Stepway',
    version: 'Stepway Comfort',
    annee: 2025,
    immatriculation: 'WW-593-BD',
    couleur: 'Bleu',
    places: 5,
    carburant: 'Essence',
    boite: 'Automatique',
    kilometrage: 13200,
    prix_par_jour: 11000,
    caution: 12000,
    statut: 'Disponible',
    prochain_entretien: '2025-02-10',
    notes: 'Stepway 2025. Vidange tous les 10 000 km.',
    photo_principale: stepway,
    galerie: [stepway, stepway, stepway]
  },
  {
    id: 'vehicule-3',
    marque: 'Volkswagen',
    modele: 'Golf 8.5',
    version: 'GTI',
    annee: 2024,
    immatriculation: '789-GHI-27',
    couleur: 'Gris Nardo',
    places: 5,
    carburant: 'Essence',
    boite: 'Automatique',
    kilometrage: 5400,
    prix_par_jour: 23000,
    caution: 20000,
    statut: 'Disponible',
    prochain_entretien: '2025-04-01',
    notes: 'Confort premium, phares LED adaptatifs.',
    photo_principale: golf85,
    galerie: [golf85, golf85, golf85]
  },
  {
    id: 'vehicule-4',
    marque: 'Volkswagen',
    modele: 'Polo R-Line',
    version: 'R-Line',
    annee: 2022,
    immatriculation: '52779-122-31',
    couleur: 'Blanc',
    places: 5,
    carburant: 'Essence',
    boite: 'Manuelle',
    kilometrage: 7600,
    prix_par_jour: 12000,
    caution: 17000,
    statut: 'Disponible',
    prochain_entretien: '2025-01-25',
    notes: 'Polo R-Line 2022. Vidange tous les 10 000 km.',
    photo_principale: poloRline,
    galerie: [poloRline, poloRline, poloRline]
  }
]
