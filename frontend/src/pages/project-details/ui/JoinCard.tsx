import { Link as RouterLink, useLocation } from 'react-router-dom'
import { Button, Card, CardContent, Typography } from '@mui/material'
import type { Project } from '../../../entities/project'
import { pluralize } from '../../../shared/lib/format'

interface JoinCardProps {
  project: Project
  isAuthenticated: boolean
  isOwner: boolean
  isMember: boolean
  onApply: () => void
}

export function JoinCard({ project, isAuthenticated, isOwner, isMember, onApply }: JoinCardProps) {
  const location = useLocation()
  const { openRolesCount } = project

  let text = openRolesCount
    ? `Открыто ${openRolesCount} ${pluralize(openRolesCount, ['роль', 'роли', 'ролей'])}. Расскажите о себе в заявке.`
    : 'Набор в команду сейчас закрыт.'
  if (isOwner) text = 'Это ваш проект. Заявки кандидатов появятся в разделе «Заявки».'
  else if (isMember) text = 'Вы участник команды этого проекта.'

  return (
    <Card sx={{ mb: 3, bgcolor: openRolesCount && !isOwner && !isMember ? 'rgba(46, 125, 50, 0.06)' : undefined }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {isOwner ? 'Ваш проект' : isMember ? 'Вы в команде' : 'Хотите в команду?'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          {text}
        </Typography>
        {isOwner ? (
          <Button fullWidth variant="outlined" component={RouterLink} to="/applications?tab=incoming">
            Смотреть заявки
          </Button>
        ) : isMember ? null : isAuthenticated ? (
          <Button fullWidth variant="contained" disabled={!openRolesCount} onClick={onApply}>
            Подать заявку
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            component={RouterLink}
            to={`/login?next=${encodeURIComponent(location.pathname)}`}
          >
            Войдите, чтобы подать заявку
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
