import { api, type Page } from '../../../shared/api'
import type { Project, ProjectFilters, ProjectInput } from '../model/types'

export const projectApi = {
  list: (filters: ProjectFilters) => api.get<Page<Project>>('/projects', { ...filters }),
  get: (id: number) => api.get<Project>(`/projects/${id}`),
  create: (input: ProjectInput) => api.post<Project>('/projects', input),
  update: (id: number, input: Partial<ProjectInput>) => api.patch<Project>(`/projects/${id}`, input),
  remove: (id: number) => api.delete(`/projects/${id}`),
  removeMember: (projectId: number, memberId: number) => api.delete(`/projects/${projectId}/members/${memberId}`),
}
