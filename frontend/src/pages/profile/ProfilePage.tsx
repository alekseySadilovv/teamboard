import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { ProjectCard, ProjectCardSkeleton, useProjects } from '../../entities/project'
import { useSession } from '../../entities/session'
import { UserAvatar } from '../../entities/user'
import { EditProfileDialog } from '../../features/edit-profile'
import { formatDate } from '../../shared/lib/format'
import { Appear, EmptyState, ErrorState } from '../../shared/ui'

function ProjectsSection({ title, filters, emptyText, excludeOwnerId }: {
  title: string
  filters: { ownerId?: number; memberId?: number }
  emptyText: string
  excludeOwnerId?: number
}) {
  const { data, isPending, isError, error, refetch } = useProjects({ ...filters, limit: 100 })
  const items = data?.items.filter((project) => project.owner.id !== excludeOwnerId) ?? []

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      {isPending ? (
        <Grid container spacing={2}>
          {[0, 1].map((index) => (
            <Grid key={index} size={{ xs: 12, sm: 6 }}>
              <ProjectCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : items.length === 0 ? (
        <Typography sx={{ color: 'text.secondary' }}>{emptyText}</Typography>
      ) : (
        <Grid container spacing={2}>
          {items.map((project, index) => (
            <Grid key={project.id} size={{ xs: 12, sm: 6 }}>
              <Appear index={index}>
                <ProjectCard project={project} />
              </Appear>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export function ProfilePage() {
  const { user } = useSession()
  const [editOpen, setEditOpen] = useState(false)

  if (!user) return <EmptyState title="Профиль недоступен" />

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ position: { md: 'sticky' }, top: { md: 88 } }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <UserAvatar user={user} sx={{ width: 88, height: 88, mx: 'auto', mb: 2, fontSize: 36 }} />
            <Typography variant="h5">{user.fullName}</Typography>
            <Typography sx={{ color: 'text.secondary' }}>@{user.username}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {user.email}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
              На TeamBoard с {formatDate(user.createdAt)}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
              {user.bio || 'Расскажите о себе — это поможет авторам проектов'}
            </Typography>
            <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
              {user.skills.map((skill) => (
                <Chip key={skill} label={skill} size="small" color="secondary" variant="outlined" />
              ))}
            </Stack>
            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setEditOpen(true)}>
              Редактировать профиль
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <ProjectsSection
          title="Мои проекты"
          filters={{ ownerId: user.id }}
          emptyText="Вы ещё не разместили ни одной идеи"
        />
        <ProjectsSection
          title="Участвую в командах"
          filters={{ memberId: user.id }}
          excludeOwnerId={user.id}
          emptyText="Пока вы не состоите в чужих командах"
        />
        <Button component={RouterLink} to="/projects/new" variant="contained">
          Разместить идею
        </Button>
      </Grid>
      <EditProfileDialog user={user} open={editOpen} onClose={() => setEditOpen(false)} />
    </Grid>
  )
}
