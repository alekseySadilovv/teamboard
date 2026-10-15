import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { applicationApi } from '../api/applicationApi'
import type { ApplicationInput, ApplicationStatus } from './types'

export const applicationKeys = {
  all: ['applications'] as const,
  mine: ['applications', 'my'] as const,
  incoming: ['applications', 'incoming'] as const,
}

export function useMyApplications(enabled = true) {
  return useQuery({ queryKey: applicationKeys.mine, queryFn: applicationApi.listMine, enabled })
}

export function useIncomingApplications(enabled = true) {
  return useQuery({ queryKey: applicationKeys.incoming, queryFn: applicationApi.listIncoming, enabled })
}

function useInvalidateApplications() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: applicationKeys.all })
    queryClient.invalidateQueries({ queryKey: ['projects'] })
  }
}

export function useCreateApplication() {
  const invalidate = useInvalidateApplications()
  return useMutation({ mutationFn: (input: ApplicationInput) => applicationApi.create(input), onSuccess: invalidate })
}

export function useDecideApplication() {
  const invalidate = useInvalidateApplications()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: Exclude<ApplicationStatus, 'pending'> }) =>
      applicationApi.decide(id, status),
    onSuccess: invalidate,
  })
}

export function useWithdrawApplication() {
  const invalidate = useInvalidateApplications()
  return useMutation({ mutationFn: (id: number) => applicationApi.withdraw(id), onSuccess: invalidate })
}
