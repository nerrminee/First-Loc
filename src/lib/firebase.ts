import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCXoXrOkdpZ7w9LV-0Rryi22FNJaQYL-ZM',
  authDomain: 'firstloc-71a47.firebaseapp.com',
  projectId: 'firstloc-71a47',
  storageBucket: 'firstloc-71a47.firebasestorage.app',
  messagingSenderId: '929494398127',
  appId: '1:929494398127:web:7570b1077e9d14f519505a'
}

export const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)

// Firestore database used by reservations, rentals, vehicles and maintenance.
export const db = getFirestore(firebaseApp)
