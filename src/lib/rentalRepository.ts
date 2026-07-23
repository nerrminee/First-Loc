import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { AdminVehicle, MaintenanceRecord, Rental, Reservation, ReturnRentalInput, StartRentalInput, VehicleAdminStatus } from '../types/rental'

const clean = <T extends object>(value: T) => Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined))
const subscribe = <T extends { id: string }>(name: string, callback: (items: T[]) => void) =>
  onSnapshot(query(collection(db, name)), (snapshot) => callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T)), (error) => console.error(`[${name}]`, error))

export const subscribeReservations = (callback: (items: Reservation[]) => void) => subscribe('reservations', callback)
export const subscribeRentals = (callback: (items: Rental[]) => void) => subscribe('rentals', callback)
export const subscribeVehicles = (callback: (items: AdminVehicle[]) => void) => subscribe('vehicles', callback)
export const subscribeMaintenance = (callback: (items: MaintenanceRecord[]) => void) => subscribe('maintenance', callback)

type ReservationInput = Omit<Reservation, 'id' | 'createdAt' | 'status' | 'source'>

export const createReservation = async (data: ReservationInput) => {
  const ref = await addDoc(collection(db, 'reservations'), clean({ ...data, source: 'En ligne', status: 'En attente', createdAt: new Date().toISOString(), createdAtServer: serverTimestamp() }))
  return ref.id
}
export const createManualReservation = async (data: ReservationInput) => {
  const ref = await addDoc(collection(db, 'reservations'), clean({ ...data, source: 'Téléphone', status: 'En attente', createdAt: new Date().toISOString(), createdAtServer: serverTimestamp() }))
  return ref.id
}
export const setReservationStatus = (id: string, status: Reservation['status']) => updateDoc(doc(db, 'reservations', id), { status, updatedAt: new Date().toISOString() })
export const deleteReservation = (id: string) => deleteDoc(doc(db, 'reservations', id))
export const saveVehicle = (vehicle: AdminVehicle) => setDoc(doc(db, 'vehicles', vehicle.id), clean(vehicle), { merge: true })
export const setVehicleStatus = (id: string, status: VehicleAdminStatus) => setDoc(doc(db, 'vehicles', id), { status }, { merge: true })

const catalogUpdates = [
  { id: 'vehicule-1', brand: 'Renault', model: 'Clio 5 Alpine', year: 2025, registration: 'WW-895-SE', color: 'Noir', pricePerDay: 12000, oilChangeInterval: 10000, notes: 'Clio 5 Alpine 2025. Vidange tous les 10 000 km.' },
  { id: 'vehicule-2', brand: 'Dacia', model: 'Sandero Stepway', year: 2025, registration: 'WW-593-BD', color: 'Bleu', pricePerDay: 11000, oilChangeInterval: 10000, notes: 'Stepway 2025. Vidange tous les 10 000 km.' },
  { id: 'vehicule-3', brand: 'Volkswagen', model: 'Golf 8.5', color: 'Gris Nardo', pricePerDay: 23000, oilChangeInterval: 10000 },
  { id: 'vehicule-4', brand: 'Volkswagen', model: 'Polo R-Line', year: 2022, registration: '52779-122-31', color: 'Blanc', pricePerDay: 12000, oilChangeInterval: 10000, notes: 'Polo R-Line 2022. Vidange tous les 10 000 km.' },
] as const

export const syncVehicleCatalog = async () => {
  await Promise.all(catalogUpdates.map(async (update) => {
    const vehicleRef = doc(db, 'vehicles', update.id)
    const snapshot = await getDoc(vehicleRef)
    if ((snapshot.data()?.catalogVersion || 0) >= 3) return
    await setDoc(vehicleRef, { ...update, catalogVersion: 3 }, { merge: true })
  }))
}

export const createRentalFromReservation = async (reservation: Reservation, input: StartRentalInput) => {
  if (input.startMileage < 0 || input.amountPaid < 0 || input.rentalPrice < 0) throw new Error('Les valeurs kilométriques et monétaires doivent être positives.')
  const now = new Date().toISOString()
  const rental: Omit<Rental, 'id'> = { reservationId: reservation.id, vehicleId: reservation.vehicleId, clientName: reservation.clientName, phone: reservation.phone, plannedStartDate: reservation.startDate, plannedEndDate: reservation.endDate, actualStartDate: input.actualStartDate, actualStartTime: input.actualStartTime, startMileage: input.startMileage, rentalPrice: input.rentalPrice, extraFees: 0, extraFeesReason: '', finalPrice: input.rentalPrice, amountPaid: input.amountPaid, remainingAmount: Math.max(0, input.rentalPrice - input.amountPaid), deposit: input.deposit, fuelStart: input.fuelStart, departureCondition: input.departureCondition, status: 'En cours', notes: input.notes, createdAt: now, updatedAt: now }
  const ref = await addDoc(collection(db, 'rentals'), clean(rental))
  await Promise.all([setVehicleStatus(reservation.vehicleId, 'Loué'), updateDoc(doc(db, 'reservations', reservation.id), { rentalId: ref.id, updatedAt: now })])
  return ref.id
}

export const completeRental = async (rental: Rental, input: ReturnRentalInput) => {
  if (input.returnMileage < rental.startMileage) throw new Error('Le kilométrage retour doit être supérieur ou égal au kilométrage départ.')
  if (input.extraFees < 0 || input.paymentAtReturn < 0) throw new Error('Les montants ne peuvent pas être négatifs.')
  const finalPrice = rental.rentalPrice + input.extraFees
  const amountPaid = rental.amountPaid + input.paymentAtReturn
  const now = new Date().toISOString()
  await Promise.all([
    updateDoc(doc(db, 'rentals', rental.id), clean({ ...input, distanceDriven: input.returnMileage - rental.startMileage, finalPrice, amountPaid, remainingAmount: Math.max(0, finalPrice - amountPaid), status: 'Terminée', updatedAt: now })),
    setDoc(doc(db, 'vehicles', rental.vehicleId), { currentMileage: input.returnMileage, status: input.maintenanceRequired ? 'Entretien' : 'Disponible' }, { merge: true }),
  ])
}
export const addRentalPayment = async (rental: Rental, amount: number) => {
  if (amount <= 0) throw new Error('Le paiement doit être supérieur à zéro.')
  const paid = rental.amountPaid + amount
  await updateDoc(doc(db, 'rentals', rental.id), { amountPaid: paid, remainingAmount: Math.max(0, rental.finalPrice - paid), updatedAt: new Date().toISOString() })
}
export const deleteRental = async (rental: Rental) => {
  await deleteDoc(doc(db, 'rentals', rental.id))
  if (rental.status === 'En cours') await setVehicleStatus(rental.vehicleId, 'Disponible')
}
export const addMaintenance = async (data: Omit<MaintenanceRecord, 'id' | 'createdAt'>) => {
  const now = new Date().toISOString()
  const ref = await addDoc(collection(db, 'maintenance'), clean({ ...data, createdAt: now }))
  const vehicleUpdate = data.type === 'Vidange'
    ? { currentMileage: data.mileage, lastOilChangeDate: data.date, lastOilChangeMileage: data.mileage, nextOilChangeMileage: data.nextMaintenanceMileage, status: 'Disponible' }
    : { currentMileage: data.mileage }
  await setDoc(doc(db, 'vehicles', data.vehicleId), vehicleUpdate, { merge: true })
  return ref.id
}
export const deleteMaintenance = (id: string) => deleteDoc(doc(db, 'maintenance', id))

export const clearTestData = async () => {
  const [reservations, rentals, maintenance, vehicles] = await Promise.all([
    getDocs(collection(db, 'reservations')),
    getDocs(collection(db, 'rentals')),
    getDocs(collection(db, 'maintenance')),
    getDocs(collection(db, 'vehicles')),
  ])
  await Promise.all([
    ...reservations.docs.map((item) => deleteDoc(item.ref)),
    ...rentals.docs.map((item) => deleteDoc(item.ref)),
    ...maintenance.docs.map((item) => deleteDoc(item.ref)),
    ...vehicles.docs.map((item) => setDoc(item.ref, { status: 'Disponible' }, { merge: true })),
    ...['vehicule-1', 'vehicule-2', 'vehicule-3', 'vehicule-4'].map((id) => setDoc(doc(db, 'vehicles', id), { status: 'Disponible' }, { merge: true })),
  ])
  return {
    reservations: reservations.size,
    rentals: rentals.size,
    maintenance: maintenance.size,
  }
}
