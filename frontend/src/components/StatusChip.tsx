import { Chip } from '@mui/material'
import { statusLabels, type ProjectStatus } from '../data/mock'

const colors: Record<ProjectStatus, 'default' | 'success' | 'info' | 'warning'> = {
  idea: 'default',
  recruiting: 'success',
  in_progress: 'info',
  completed: 'warning',
}

export function StatusChip({ status }: { status: ProjectStatus }) {
  return <Chip size="small" label={statusLabels[status]} color={colors[status]} />
}
