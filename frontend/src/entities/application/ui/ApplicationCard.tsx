import type { ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Card, CardActions, CardContent, Link, Typography } from '@mui/material'
import { formatDate } from '../../../shared/lib/format'
import { UserAvatar } from '../../user'
import type { Application } from '../model/types'
import { ApplicationStatusChip } from './ApplicationStatusChip'

interface ApplicationCardProps {
  application: Application
  showApplicant?: boolean
  actions?: ReactNode
}

export function ApplicationCard({ application, showApplicant, actions }: ApplicationCardProps) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 1, flexWrap: 'wrap' }}>
          <Link component={RouterLink} to={`/projects/${application.projectId}`} variant="h6" underline="hover">
            {application.projectTitle}
          </Link>
          <ApplicationStatusChip status={application.status} />
        </Box>
        <Typography variant="body2" gutterBottom sx={{ color: 'text.secondary' }}>
          Роль: <b>{application.roleTitle}</b> · {formatDate(application.createdAt)}
        </Typography>
        {showApplicant && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1.5 }}>
            <UserAvatar user={application.user} sx={{ width: 32, height: 32, fontSize: 14 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {application.user.fullName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                @{application.user.username}
              </Typography>
            </Box>
          </Box>
        )}
        <Typography sx={{ whiteSpace: 'pre-line' }}>{application.message || 'Без сопроводительного сообщения'}</Typography>
      </CardContent>
      {actions && <CardActions sx={{ px: 2, pb: 2 }}>{actions}</CardActions>}
    </Card>
  )
}
