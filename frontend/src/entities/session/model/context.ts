import { createContext, useContext } from 'react'
import type { User } from '../../user'
import type { LoginInput, RegisterInput, SessionStatus } from './types'

export interface SessionContextValue {
  user: User | null
  status: SessionStatus
  login: (input: LoginInput) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User) => void
}

export const SessionContext = createContext<SessionContextValue | null>(null)

export function useSession(): SessionContextValue {
  const value = useContext(SessionContext)
  if (!value) throw new Error('useSession должен использоваться внутри SessionProvider')
  return value
}
