export type AdminAccount = { username: string; role: 'admin1' | 'admin2' }

const ADMIN_ACCOUNTS = [
  { username: 'firstlocdz', password: 'rachel2005', role: 'admin1' },
  { username: 'bouchra', password: 'bouboucha', role: 'admin2' },
] as const

const SESSION_KEY = 'firstloc_admin_session'

export const getCurrentAdmin = (): AdminAccount | null => {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null') as AdminAccount | null
    if (!session || !ADMIN_ACCOUNTS.some((account) => account.username === session.username && account.role === session.role)) return null
    return session
  } catch {
    return null
  }
}

export const isAuthenticated = () => getCurrentAdmin() !== null

export const authenticate = (username: string, password: string) =>
  ADMIN_ACCOUNTS.find((account) => account.username === username && account.password === password) ?? null

export const login = (username: string, password: string) => {
  const account = authenticate(username, password)
  if (!account) return false
  localStorage.setItem(SESSION_KEY, JSON.stringify({ username: account.username, role: account.role }))
  return true
}

export const logout = () => {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('username')
  localStorage.removeItem('userRole')
}
