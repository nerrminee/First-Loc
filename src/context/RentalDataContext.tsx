import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { demoVehicles } from '../data/vehicles'
import { addMaintenance, addRentalPayment, completeRental, createManualReservation, createRentalFromReservation, createReservation, saveVehicle, setReservationStatus, subscribeMaintenance, subscribeRentals, subscribeReservations, subscribeVehicles } from '../lib/rentalRepository'
import type { AdminVehicle, MaintenanceRecord, Rental, Reservation, ReturnRentalInput, StartRentalInput } from '../types/rental'
import { useAuth } from './AuthContext'

const seededVehicles: AdminVehicle[] = demoVehicles.map((vehicle) => { const status=String(vehicle.statut).toLowerCase(); return { id: vehicle.id, brand: vehicle.marque, model: vehicle.modele, registration: vehicle.immatriculation, year: vehicle.annee, currentMileage: vehicle.kilometrage, status: status.includes('location') ? 'Loué' : status.includes('entretien') ? 'Entretien' : status.includes('serv') ? 'Réservé' : 'Disponible', pricePerDay: vehicle.prix_par_jour, lastOilChangeMileage: Math.max(0, vehicle.kilometrage - 5000), oilChangeInterval: 10000, nextOilChangeMileage: Math.max(10000, vehicle.kilometrage + 5000), notes: vehicle.notes, photo: vehicle.photo_principale } })

type DataContext = {
  reservations: Reservation[]; rentals: Rental[]; vehicles: AdminVehicle[]; maintenance: MaintenanceRecord[]; loading: boolean
  submitReservation: typeof createReservation; changeReservationStatus: (id: string, status: Reservation['status']) => Promise<void>
  addManualReservation: typeof createManualReservation
  startRental: (reservation: Reservation, input: StartRentalInput) => Promise<void>; returnRental: (rental: Rental, input: ReturnRentalInput) => Promise<void>
  payRental: (rental: Rental, amount: number) => Promise<void>; upsertVehicle: typeof saveVehicle; registerMaintenance: typeof addMaintenance
  hasConflict: (reservation: Reservation) => boolean
}
const Context = createContext<DataContext | null>(null)
const overlaps = (aStart: string, aEnd: string, bStart: string, bEnd: string) => aStart <= bEnd && bStart <= aEnd

export function RentalDataProvider({ children }: { children: ReactNode }) {
  const { admin, loading: authLoading } = useAuth()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [rentals, setRentals] = useState<Rental[]>([])
  const [remoteVehicles, setRemoteVehicles] = useState<AdminVehicle[]>([])
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (authLoading) return
    setLoading(true)
    const unsubs = [subscribeVehicles(setRemoteVehicles)]
    if (admin) {
      unsubs.push(
        subscribeReservations((items) => { setReservations(items); setLoading(false) }),
        subscribeRentals(setRentals),
        subscribeMaintenance(setMaintenance),
      )
    } else {
      setReservations([])
      setRentals([])
      setMaintenance([])
      setLoading(false)
    }
    const timer = window.setTimeout(() => setLoading(false), 2500)
    return () => { unsubs.forEach((unsubscribe) => unsubscribe()); window.clearTimeout(timer) }
  }, [admin, authLoading])
  const vehicles = useMemo(() => seededVehicles.map((seed) => ({ ...seed, ...remoteVehicles.find((item) => item.id === seed.id) })).concat(remoteVehicles.filter((item) => !seededVehicles.some((seed) => seed.id === item.id))), [remoteVehicles])
  const hasConflict = (reservation: Reservation) => reservations.some((item) => item.id !== reservation.id && item.vehicleId === reservation.vehicleId && item.status === 'Acceptée' && overlaps(item.startDate, item.endDate, reservation.startDate, reservation.endDate)) || rentals.some((item) => item.vehicleId === reservation.vehicleId && item.status === 'En cours' && overlaps(item.actualStartDate, item.plannedEndDate, reservation.startDate, reservation.endDate))
  const changeReservationStatus = async (id: string, status: Reservation['status']) => {
    const reservation = reservations.find((item) => item.id === id)
    if (status === 'Acceptée' && reservation && hasConflict(reservation)) throw new Error('Conflit de dates : ce véhicule est déjà réservé ou loué sur cette période.')
    await setReservationStatus(id, status)
  }
  const startRental = async (reservation: Reservation, input: StartRentalInput) => { await createRentalFromReservation(reservation, input) }
  const addManualReservation: typeof createManualReservation = async (data) => {
    const conflict = reservations.some((item) => item.vehicleId === data.vehicleId && item.status === 'Acceptée' && overlaps(item.startDate, item.endDate, data.startDate, data.endDate))
      || rentals.some((item) => item.vehicleId === data.vehicleId && item.status === 'En cours' && overlaps(item.actualStartDate, item.plannedEndDate, data.startDate, data.endDate))
    if (conflict) throw new Error('Conflit de dates : ce véhicule est déjà réservé ou loué sur cette période.')
    const vehicle = vehicles.find((item) => item.id === data.vehicleId)
    if (vehicle && ['Entretien', 'Indisponible'].includes(vehicle.status)) throw new Error('Ce véhicule est actuellement indisponible.')
    return createManualReservation(data)
  }
  const returnRental = async (rental: Rental, input: ReturnRentalInput) => { const vehicle = vehicles.find((item) => item.id === rental.vehicleId); if (vehicle && input.returnMileage < vehicle.currentMileage) throw new Error(`Le kilométrage ne peut pas être inférieur au kilométrage actuel (${vehicle.currentMileage.toLocaleString()} km).`); await completeRental(rental, input) }
  return <Context.Provider value={{ reservations, rentals, vehicles, maintenance, loading, submitReservation: createReservation, addManualReservation, changeReservationStatus, startRental, returnRental, payRental: addRentalPayment, upsertVehicle: saveVehicle, registerMaintenance: addMaintenance, hasConflict }}>{children}</Context.Provider>
}
export const useRentalData = () => { const value = useContext(Context); if (!value) throw new Error('RentalDataProvider manquant'); return value }
