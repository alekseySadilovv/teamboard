import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { setUnauthorizedListener, syncDemoUser } from '../../../shared/api'
import { userApi, type User } from '../../user'
import { sessionApi } from '../api/sessionApi'
import { SessionContext } from './context'
import type { LoginInput, RegisterInput, SessionStatus } from './types'

export function SessionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUserState] = useState<User | null>(null)
  const [status, setStatus] = useState<SessionStatus>('loading')
  const statusRef = useRef<SessionStatus>('loading')

  const applyUser = useCallback((value: User | null) => {
    syncDemoUser(value)
    setUserState(value)
    statusRef.current = value ? 'authenticated' : 'anonymous'
    setStatus(statusRef.current)
  }, [])

  const resetCache = useCallback(() => {
    queryClient.removeQueries({ predicate: (query) => query.getObserversCount() === 0 })
    queryClient.invalidateQueries()
  }, [queryClient])

  useEffect(() => {
    setUnauthorizedListener(() => {
      if (statusRef.current !== 'authenticated') return
      applyUser(null)
      resetCache()
    })
    userApi
      .me()
      .then(applyUser)
      .catch(() => applyUser(null))
    return () => setUnauthorizedListener(null)
  }, [applyUser, resetCache])

  const login = useCallback(
    async (input: LoginInput) => {
      const { user: value } = await sessionApi.login(input)
      applyUser(value)
      resetCache()
    },
    [applyUser, resetCache],
  )

  const register = useCallback(
    async (input: RegisterInput) => {
      const { user: value } = await sessionApi.register(input)
      applyUser(value)
      resetCache()
    },
    [applyUser, resetCache],
  )

  const logout = useCallback(async () => {
    try {
      await sessionApi.logout()
    } finally {
      applyUser(null)
      resetCache()
    }
  }, [applyUser, resetCache])

  const value = useMemo(
    () => ({ user, status, login, register, logout, setUser: applyUser }),
    [user, status, login, register, logout, applyUser],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
