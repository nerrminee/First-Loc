export type ReservationStatus = 'En attente' | 'Acceptée' | 'Refusée' | 'Annulée'
export type VehicleAdminStatus = 'Disponible' | 'Réservé' | 'Loué' | 'Entretien' | 'Indisponible'
export type PaymentStatus = 'Payé' | 'Partiellement payé' | 'Non payé'
export type MaintenanceType = 'Vidange' | 'Filtre à huile' | 'Filtre à air' | 'Filtre habitacle' | 'Pneus' | 'Freins' | 'Batterie' | 'Révision' | 'Assurance' | 'Contrôle technique' | 'Autre'

export interface AdminVehicle {
  id: string; brand: string; model: string; registration: string; year: number; currentMileage: number
  status: VehicleAdminStatus; pricePerDay: number; lastOilChangeDate?: string; lastOilChangeMileage: number; oilChangeInterval: number
  nextOilChangeMileage: number; notes: string; photo?: string; catalogVersion?: number
}
export interface Reservation {
  id: string; clientName: string; phone: string; vehicleId: string; startDate: string; endDate: string
  days: number; totalPrice: number; paymentMethod: string; status: ReservationStatus
  source?: 'En ligne' | 'Téléphone'; rentalId?: string; createdAt: string
}
export interface Rental {
  id: string; reservationId: string; vehicleId: string; clientName: string; phone: string
  plannedStartDate: string; plannedEndDate: string; actualStartDate: string; actualStartTime: string
  actualReturnDate?: string; actualReturnTime?: string; startMileage: number; returnMileage?: number; distanceDriven?: number
  rentalPrice: number; extraFees: number; extraFeesReason: string; finalPrice: number; amountPaid: number
  remainingAmount: number; deposit: number; fuelStart: string; fuelReturn?: string; departureCondition: string
  returnCondition?: string; status: 'En cours' | 'Terminée'; notes: string; maintenanceRequired?: boolean
  createdAt: string; updatedAt: string
}
export interface MaintenanceRecord {
  id: string; vehicleId: string; type: MaintenanceType; date: string; mileage: number; cost: number
  garage: string; notes: string; nextMaintenanceMileage?: number; nextMaintenanceDate?: string; createdAt: string
}
export interface StartRentalInput { startMileage: number; actualStartDate: string; actualStartTime: string; rentalPrice: number; amountPaid: number; deposit: number; fuelStart: string; departureCondition: string; notes: string }
export interface ReturnRentalInput { actualReturnDate: string; actualReturnTime: string; returnMileage: number; fuelReturn: string; returnCondition: string; extraFees: number; extraFeesReason: string; paymentAtReturn: number; notes: string; maintenanceRequired: boolean }
