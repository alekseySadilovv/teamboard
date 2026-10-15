import { useState } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { Box, Button, Card, CardContent, Grid, Skeleton, Stack, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import { ProjectStatusChip, useProject } from '../../entities/project'
import { useSession } from '../../entities/session'
import { ApplyDialog } from '../../features/apply-to-project'
import { DeleteProjectButton } from '../../features/delete-project'
import { ApiError } from '../../shared/api'
import { formatDate } from '../../shared/lib/format'
import { EmptyState, ErrorState, TagChip } from '../../shared/ui'
import { JoinCard } from './ui/JoinCard'
import { RolesList } from './ui/RolesList'
import { TeamCard } from './ui/TeamCard'

function DetailsSkeleton() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Skeleton variant="rounded" height={260} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={90} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={90} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Skeleton variant="rounded" height={150} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={200} />
      </Grid>
    </Grid>
  )
}

export function ProjectDetailsPage() {
  const projectId = Number(useParams().id)
  const navigate = useNavigate()
  const { user } = useSession()
  const { data: project, isPending, isError, error, refetch } = useProject(projectId)
  const [applyRoleId, setApplyRoleId] = useState<number | undefined>()
  const [dialogOpen, setDialogOpen] = useState(false)

  const backButton = (
    <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
      Ко всем проектам
    </Button>
  )

  if (isPending) {
    return (
      <>
        {backButton}
        <DetailsSkeleton />
      </>
    )
  }

  if (isError) {
    return (
      <>
        {backButton}
        {error instanceof ApiError && error.status === 404 ? (
          <EmptyState title="Проект не найден" description="Возможно, он был удалён автором" />
        ) : (
          <ErrorState error={error} onRetry={() => refetch()} />
        )}
      </>
    )
  }

  const isOwner = user?.id === project.owner.id
  const isMember = !isOwner && project.members.some((member) => member.user.id === user?.id)
  const canApply = Boolean(user) && !isOwner && !isMember

  const openApply = (roleId?: number) => {
    setApplyRoleId(roleId)
    setDialogOpen(true)
  }

  return (
    <>
      {backButton}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
                <ProjectStatusChip status={project.status} />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Создан {formatDate(project.createdAt)} · автор {project.owner.fullName}
                </Typography>
              </Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ wordBreak: 'break-word' }}>
                {project.title}
              </Typography>
              <Typography variant="subtitle1" gutterBottom sx={{ color: 'text.secondary' }}>
                {project.summary}
              </Typography>
              {project.description && <Typography sx={{ my: 2, whiteSpace: 'pre-line' }}>{project.description}</Typography>}
              <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: 'wrap' }}>
                {project.tags.map((tag) => (
                  <TagChip key={tag} tag={tag} clickable onClick={() => navigate(`/?tag=${encodeURIComponent(tag)}`)} />
                ))}
              </Stack>
              {isOwner && (
                <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                  <Button component={RouterLink} to={`/projects/${project.id}/edit`} startIcon={<EditIcon />} variant="outlined">
                    Редактировать
                  </Button>
                  <DeleteProjectButton project={project} />
                </Stack>
              )}
            </CardContent>
          </Card>

          <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
            Роли в команде
          </Typography>
          <RolesList roles={project.roles} canApply={canApply} onApply={openApply} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <JoinCard
            project={project}
            isAuthenticated={Boolean(user)}
            isOwner={isOwner}
            isMember={isMember}
            onApply={() => openApply()}
          />
          <TeamCard members={project.members} />
        </Grid>
      </Grid>

      {canApply && (
        <ApplyDialog project={project} open={dialogOpen} initialRoleId={applyRoleId} onClose={() => setDialogOpen(false)} />
      )}
    </>
  )
}
