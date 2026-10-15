import type { ReactNode } from 'react'
import { Alert, Box, Button, CircularProgress, Fade, Typography } from '@mui/material'
import InboxIcon from '@mui/icons-material/Inbox'
import { getErrorMessage } from '../api/errors'

export function LoadingState({ label = 'Загрузка…' }: { label?: string }) {
  return (
    <Fade in style={{ transitionDelay: '150ms' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 8 }} role="status">
        <CircularProgress />
        <Typography sx={{ color: 'text.secondary' }}>{label}</Typography>
      </Box>
    </Fade>
  )
}

interface ErrorStateProps {
  error: unknown
  onRetry?: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <Fade in>
      <Alert
        severity="error"
        sx={{ my: 2 }}
        action={
          onRetry && (
            <Button color="inherit" size="small" onClick={onRetry}>
              Повторить
            </Button>
          )
        }
      >
        {getErrorMessage(error)}
      </Alert>
    </Fade>
  )
}

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <Fade in>
      <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
        <Box sx={{ fontSize: 56, lineHeight: 1, mb: 1, color: 'action.disabled' }}>
          {icon ?? <InboxIcon fontSize="inherit" />}
        </Box>
        <Typography variant="h6" sx={{ color: 'text.primary' }}>
          {title}
        </Typography>
        {description && <Typography sx={{ mt: 0.5 }}>{description}</Typography>}
        {action && <Box sx={{ mt: 2 }}>{action}</Box>}
      </Box>
    </Fade>
  )
}
