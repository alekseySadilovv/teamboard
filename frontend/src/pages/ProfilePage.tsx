import { Avatar, Box, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material'
import { ProjectCard } from '../components/ProjectCard'
import { currentUser, projects } from '../data/mock'

export function ProfilePage() {
  const ownProjects = projects.filter((project) => project.ownerId === currentUser.id)
  const memberProjects = projects.filter(
    (project) => project.ownerId !== currentUser.id && project.members.some((m) => m.userId === currentUser.id),
  )

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Avatar sx={{ width: 88, height: 88, mx: 'auto', mb: 2, fontSize: 36, bgcolor: 'primary.main' }}>
              {currentUser.fullName[0]}
            </Avatar>
            <Typography variant="h5">{currentUser.fullName}</Typography>
            <Typography color="text.secondary">@{currentUser.username}</Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
              {currentUser.email}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {currentUser.bio}
            </Typography>
            <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
              {currentUser.skills.map((skill) => (
                <Chip key={skill} label={skill} size="small" color="secondary" variant="outlined" />
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Typography variant="h5" gutterBottom>
          Мои проекты
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {ownProjects.map((project) => (
            <Grid key={project.id} size={{ xs: 12, sm: 6 }}>
              <ProjectCard project={project} />
            </Grid>
          ))}
        </Grid>
        <Typography variant="h5" gutterBottom>
          Участвую в командах
        </Typography>
        <Box>
          <Grid container spacing={2}>
            {memberProjects.map((project) => (
              <Grid key={project.id} size={{ xs: 12, sm: 6 }}>
                <ProjectCard project={project} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  )
}
