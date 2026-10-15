import { Chip } from '@mui/material'
import type { ApplicationStatus } from '../model/types'

const labels: Record<ApplicationStatus, string> = {
  pending: 'На рассмотрении',
  accepted: 'Принята',
  rejected: 'Отклонена',
}

const colors = { pending: 'warning', accepted: 'success', rejected: 'error' } as const

export function ApplicationStatusChip({ status }: { status: ApplicationStatus }) {
  return <Chip size="small" label={labels[status]} color={colors[status]} />
}
