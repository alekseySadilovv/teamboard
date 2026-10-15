import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { userApi, type User } from '../../user'
import { sessionApi } from '../api/sessionApi'
import { SessionContext } from './context'
import type { LoginInput, RegisterInput, SessionStatus } from './types'

export function SessionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<SessionStatus>('loading')

  const applyUser = useCallback((value: User | null) => {
    setUser(value)
    setStatus(value ? 'authenticated' : 'anonymous')
  }, [])

  useEffect(() => {
    userApi
      .me()
      .then(applyUser)
      .catch(() => applyUser(null))
  }, [applyUser])

  const login = useCallback(
    async (input: LoginInput) => {
      const { user: value } = await sessionApi.login(input)
      queryClient.clear()
      applyUser(value)
    },
    [applyUser, queryClient],
  )

  const register = useCallback(
    async (input: RegisterInput) => {
      const { user: value } = await sessionApi.register(input)
      queryClient.clear()
      applyUser(value)
    },
    [applyUser, queryClient],
  )

  const logout = useCallback(async () => {
    try {
      await sessionApi.logout()
    } finally {
      queryClient.clear()
      applyUser(null)
    }
  }, [applyUser, queryClient])

  const value = useMemo(
    () => ({ user, status, login, register, logout, setUser }),
    [user, status, login, register, logout],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
