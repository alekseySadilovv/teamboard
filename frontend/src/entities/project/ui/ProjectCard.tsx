import { Link as RouterLink } from 'react-router-dom'
import { Box, Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import { TagChip } from '../../../shared/ui'
import { formatDate, pluralize } from '../../../shared/lib/format'
import type { Project } from '../model/types'
import { ProjectStatusChip } from './ProjectStatusChip'

export function ProjectCard({ project }: { project: Project }) {
  const { openRolesCount } = project

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/projects/${project.id}`}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <ProjectStatusChip status={project.status} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {formatDate(project.createdAt)}
            </Typography>
          </Box>
          <Typography variant="h6" gutterBottom>
            {project.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            {project.summary}
          </Typography>
          <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: 'wrap', mb: 2 }}>
            {project.tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </Stack>
          <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: openRolesCount ? 'success.main' : 'text.secondary' }}>
              {openRolesCount
                ? `Ищем: ${openRolesCount} ${pluralize(openRolesCount, ['роль', 'роли', 'ролей'])}`
                : 'Набор закрыт'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
              <PeopleIcon fontSize="small" />
              <Typography variant="body2">{project.members.length}</Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
