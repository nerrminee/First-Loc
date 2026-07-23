import { useMemo } from 'react'
import { useRentalData } from '../context/RentalDataContext'
import { demoVehicles } from '../data/vehicles'
import type { VehicleStatus } from '../types'
import type { VehicleAdminStatus } from '../types/rental'

const publicStatus: Record<VehicleAdminStatus, VehicleStatus> = {
  Disponible: 'Disponible',
  Réservé: 'Réservé',
  Loué: 'En location',
  Entretien: 'En entretien',
  Indisponible: 'Indisponible',
}

export function usePublicVehicles() {
  const { vehicles } = useRentalData()

  return useMemo(
    () => demoVehicles.map((vehicle) => {
      const adminVehicle = vehicles.find((item) => item.id === vehicle.id)
      return {
        ...vehicle,
        statut: adminVehicle ? publicStatus[adminVehicle.status] : vehicle.statut,
      }
    }),
    [vehicles],
  )
}
