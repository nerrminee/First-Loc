import type { User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'

export type AdminAccount = {
  uid: string
  email: string
  username: string
  role: string
}

export async function loadAdminAccount(user: User): Promise<AdminAccount | null> {
  const snapshot = await getDoc(doc(db, 'admins', user.uid))
  if (!snapshot.exists()) return null

  const data = snapshot.data()
  return {
    uid: user.uid,
    email: user.email || '',
    username: typeof data.name === 'string' && data.name.trim() ? data.name : user.email?.split('@')[0] || 'Administrateur',
    role: typeof data.role === 'string' ? data.role : 'admin',
  }
}
