import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { ProjectFilters, ProjectStatus } from '../../../entities/project'
import { projectStatuses } from '../../../entities/project'

export const PAGE_SIZE = 9

export interface ProjectFilterValues {
  search: string
  tags: string[]
  status: ProjectStatus | ''
  onlyRecruiting: boolean
  page: number
}

export function useProjectFilters() {
  const [params, setParams] = useSearchParams()

  const values = useMemo<ProjectFilterValues>(() => {
    const status = params.get('status') as ProjectStatus | null
    return {
      search: params.get('q') ?? '',
      tags: params.getAll('tag'),
      status: status && projectStatuses.includes(status) ? status : '',
      onlyRecruiting: params.get('open') === '1',
      page: Math.max(1, Number(params.get('page')) || 1),
    }
  }, [params])

  const update = useCallback(
    (patch: Partial<ProjectFilterValues>) => {
      const next = { ...values, page: 1, ...patch }
      const search = new URLSearchParams()
      if (next.search) search.set('q', next.search)
      next.tags.forEach((tag) => search.append('tag', tag))
      if (next.status) search.set('status', next.status)
      if (next.onlyRecruiting) search.set('open', '1')
      if (next.page > 1) search.set('page', String(next.page))
      setParams(search, { replace: true })
    },
    [values, setParams],
  )

  const reset = useCallback(() => setParams(new URLSearchParams(), { replace: true }), [setParams])

  const isActive = Boolean(values.search || values.tags.length || values.status || values.onlyRecruiting)

  return { values, update, reset, isActive }
}

export function toApiFilters(values: ProjectFilterValues): ProjectFilters {
  return {
    search: values.search || undefined,
    tags: values.tags.length ? values.tags : undefined,
    status: values.status || undefined,
    hasOpenRoles: values.onlyRecruiting || undefined,
    limit: PAGE_SIZE,
    offset: (values.page - 1) * PAGE_SIZE,
  }
}
