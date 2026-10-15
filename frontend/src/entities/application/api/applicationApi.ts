import { api } from '../../../shared/api'
import type { Application, ApplicationInput, ApplicationStatus } from '../model/types'

export const applicationApi = {
  listMine: () => api.get<Application[]>('/applications/my'),
  listIncoming: () => api.get<Application[]>('/applications/incoming'),
  create: (input: ApplicationInput) => api.post<Application>('/applications', input),
  decide: (id: number, status: Exclude<ApplicationStatus, 'pending'>) =>
    api.patch<Application>(`/applications/${id}`, { status }),
  withdraw: (id: number) => api.delete(`/applications/${id}`),
}
