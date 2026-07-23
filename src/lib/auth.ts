import type { User } from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from './firebase'

const FIRST_ADMIN_UID = 'zSQJRtEbcsYunlReTXkPtWvcPCl2'

export type AdminAccount = {
  uid: string
  email: string
  username: string
  role: string
}

export async function loadAdminAccount(user: User): Promise<AdminAccount | null> {
  const adminRef = doc(db, 'admins', user.uid)
  const snapshot = await getDoc(adminRef)
  if (!snapshot.exists()) {
    if (user.uid !== FIRST_ADMIN_UID) return null
    const username = user.email?.split('@')[0] || 'Administrateur'
    await setDoc(adminRef, {
      name: username,
      role: 'admin',
      createdAt: serverTimestamp(),
    })
    return {
      uid: user.uid,
      email: user.email || '',
      username,
      role: 'admin',
    }
  }

  const data = snapshot.data()
  return {
    uid: user.uid,
    email: user.email || '',
    username: typeof data.name === 'string' && data.name.trim() ? data.name : user.email?.split('@')[0] || 'Administrateur',
    role: typeof data.role === 'string' ? data.role : 'admin',
  }
}
