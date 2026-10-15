import { Chip } from '@mui/material'
import { projectStatusColors, projectStatusLabels } from '../model/status'
import type { ProjectStatus } from '../model/types'

export function ProjectStatusChip({ status }: { status: ProjectStatus }) {
  return <Chip size="small" label={projectStatusLabels[status]} color={projectStatusColors[status]} />
}
