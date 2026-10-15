import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { projectApi } from '../api/projectApi'
import type { Project, ProjectFilters, ProjectInput } from './types'

export const projectKeys = {
  all: ['projects'] as const,
  list: (filters: ProjectFilters) => ['projects', 'list', filters] as const,
  detail: (id: number) => ['projects', 'detail', id] as const,
}

export function useProjects(filters: ProjectFilters) {
  return useQuery({
    queryKey: projectKeys.list(filters),
    queryFn: () => projectApi.list(filters),
    placeholderData: keepPreviousData,
  })
}

export function useProject(id: number) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectApi.get(id),
    enabled: Number.isFinite(id),
  })
}

export function useSaveProject(id?: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ProjectInput) => (id ? projectApi.update(id, input) : projectApi.create(input)),
    onSuccess: (project: Project) => {
      queryClient.setQueryData(projectKeys.detail(project.id), project)
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => projectApi.remove(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: projectKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}
