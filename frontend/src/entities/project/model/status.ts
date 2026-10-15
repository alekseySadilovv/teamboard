import type { ProjectStatus } from './types'

export const projectStatusLabels: Record<ProjectStatus, string> = {
  idea: 'Идея',
  recruiting: 'Ищем роли',
  in_progress: 'В работе',
  completed: 'Завершён',
}

export const projectStatusColors: Record<ProjectStatus, 'default' | 'success' | 'info' | 'warning'> = {
  idea: 'default',
  recruiting: 'success',
  in_progress: 'info',
  completed: 'warning',
}

export const projectStatuses = Object.keys(projectStatusLabels) as ProjectStatus[]
