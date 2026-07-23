import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { loadAdminAccount, type AdminAccount } from '../lib/auth'

type AuthContextValue = {
  admin: AdminAccount | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const authMessage = (error: unknown) => {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : ''
  if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') return 'E-mail ou mot de passe incorrect.'
  if (code === 'auth/too-many-requests') return 'Trop de tentatives. Veuillez réessayer plus tard.'
  if (code === 'auth/configuration-not-found' || code === 'auth/operation-not-allowed') return 'La connexion E-mail/Mot de passe doit être activée dans Firebase Authentication.'
  return error instanceof Error ? error.message : 'Impossible de se connecter.'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminAccount | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => onAuthStateChanged(auth, async (user) => {
    setLoading(true)
    try {
      if (!user) {
        setAdmin(null)
        return
      }
      const account = await loadAdminAccount(user)
      if (!account) {
        await signOut(auth)
        setAdmin(null)
        return
      }
      setAdmin(account)
    } catch {
      setAdmin(null)
    } finally {
      setLoading(false)
    }
  }), [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      const account = await loadAdminAccount(credential.user)
      if (!account) {
        await signOut(auth)
        throw new Error('Ce compte n’est pas autorisé à accéder à l’administration.')
      }
      setAdmin(account)
    } catch (error) {
      throw new Error(authMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await signOut(auth)
    setAdmin(null)
  }

  return <AuthContext.Provider value={{ admin, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('AuthProvider manquant')
  return value
}
