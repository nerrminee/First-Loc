export type VehicleStatus = 'Disponible' | 'Réservé' | 'En location' | 'En entretien' | 'Indisponible'
export type ReservationStatus = 'Nouvelle demande' | 'À confirmer' | 'Confirmée' | 'En cours' | 'Terminée' | 'Annulée' | 'Refusée'
export type PaymentStatus = 'Non payé' | 'Acompte payé' | 'Partiellement payé' | 'Payé' | 'Remboursé'

export interface Vehicle {
  id: string
  marque: string
  modele: string
  version: string
  annee: number
  immatriculation: string
  couleur: string
  places: number
  carburant: string
  boite: string
  kilometrage: number
  prix_par_jour: number
  caution: number
  statut: VehicleStatus
  prochain_entretien: string
  notes: string
  photo_principale: string
  galerie: string[]
}

export interface ReservationRequest {
  id: string
  nom: string
  prenom: string
  telephone: string
  email: string
  adresse: string
  permis_numero: string
  permis_date: string
  vehicule_id: string
  date_depart: string
  heure_depart: string
  date_retour: string
  heure_retour: string
  lieu_depart: string
  lieu_retour: string
  jours: number
  total_estime: number
  message: string
  statut: ReservationStatus
  created_at: string
}
