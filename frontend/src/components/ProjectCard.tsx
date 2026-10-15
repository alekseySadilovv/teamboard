import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Card, CardActions, CardContent, Chip, Stack, Typography } from '@mui/material'
import type { Project } from '../data/mock'
import { StatusChip } from './StatusChip'

export function ProjectCard({ project }: { project: Project }) {
  const openRoles = project.roles.filter((role) => role.isOpen).length

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <StatusChip status={project.status} />
          <Typography variant="caption" color="text.secondary">
            {project.createdAt}
          </Typography>
        </Box>
        <Typography variant="h6" gutterBottom>
          {project.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {project.summary}
        </Typography>
        <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: 'wrap' }}>
          {project.tags.map((tag) => (
            <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" />
          ))}
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Typography variant="body2" color={openRoles ? 'success.main' : 'text.secondary'}>
          {openRoles ? `Открытых ролей: ${openRoles}` : 'Набор закрыт'}
        </Typography>
        <Button component={RouterLink} to={`/projects/${project.id}`} size="small">
          Подробнее
        </Button>
      </CardActions>
    </Card>
  )
}
