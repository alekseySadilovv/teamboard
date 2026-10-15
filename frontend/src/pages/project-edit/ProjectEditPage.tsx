import { useNavigate, useParams } from 'react-router-dom'
import { Box, Card, CardContent, Typography } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import { useProject } from '../../entities/project'
import { useSession } from '../../entities/session'
import { ProjectForm } from '../../features/project-form'
import { EmptyState, ErrorState, LoadingState, useNotify } from '../../shared/ui'

export function ProjectEditPage() {
  const { id } = useParams()
  const projectId = id ? Number(id) : undefined
  const navigate = useNavigate()
  const notify = useNotify()
  const { user } = useSession()
  const { data: project, isLoading, isError, error, refetch } = useProject(projectId ?? Number.NaN)
  const isEdit = projectId !== undefined

  let content
  if (isEdit && isLoading) {
    content = <LoadingState />
  } else if (isEdit && isError) {
    content = <ErrorState error={error} onRetry={() => refetch()} />
  } else if (isEdit && project && project.owner.id !== user?.id) {
    content = (
      <EmptyState
        icon={<LockIcon fontSize="inherit" />}
        title="Нет доступа"
        description="Редактировать проект может только его автор"
      />
    )
  } else {
    content = (
      <Card>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <ProjectForm
            project={project}
            onCancel={() => navigate(-1)}
            onSaved={(saved) => {
              notify(isEdit ? 'Изменения сохранены' : 'Проект опубликован')
              navigate(`/projects/${saved.id}`, { replace: true })
            }}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Box sx={{ maxWidth: 820, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? 'Редактирование проекта' : 'Новая идея'}
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 3 }}>
        Опишите проект и укажите, какие роли нужны команде
      </Typography>
      {content}
    </Box>
  )
}
