import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import type { Role } from '../../../entities/project'
import { Appear } from '../../../shared/ui'

interface RolesListProps {
  roles: Role[]
  canApply: boolean
  onApply: (roleId: number) => void
}

export function RolesList({ roles, canApply, onApply }: RolesListProps) {
  if (roles.length === 0) {
    return <Typography sx={{ color: 'text.secondary' }}>Автор пока не добавил роли</Typography>
  }

  return (
    <Stack spacing={2}>
      {roles.map((role, index) => (
        <Appear key={role.id} index={index}>
          <Card sx={{ borderLeft: 4, borderLeftColor: role.isOpen ? 'success.main' : 'divider' }}>
            <CardContent
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {role.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {role.description || 'Требования не указаны'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip
                  label={role.isOpen ? 'Ищем' : 'Занята'}
                  color={role.isOpen ? 'success' : 'default'}
                  variant={role.isOpen ? 'filled' : 'outlined'}
                  size="small"
                />
                {role.isOpen && canApply && (
                  <Button size="small" variant="outlined" onClick={() => onApply(role.id)}>
                    Откликнуться
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Appear>
      ))}
    </Stack>
  )
}
