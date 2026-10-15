import { useState } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import { StatusChip } from '../components/StatusChip'
import { currentUser, projects } from '../data/mock'
import { NotFoundPage } from './NotFoundPage'

export function ProjectDetailsPage() {
  const { id } = useParams()
  const project = projects.find((item) => item.id === Number(id))
  const [dialogOpen, setDialogOpen] = useState(false)

  if (!project) {
    return <NotFoundPage />
  }

  const openRoles = project.roles.filter((role) => role.isOpen)
  const isOwner = project.ownerId === currentUser.id

  return (
    <>
      <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Ко всем проектам
      </Button>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                <StatusChip status={project.status} />
                <Typography variant="caption" color="text.secondary">
                  Создан {project.createdAt} · автор {project.ownerName}
                </Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {project.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {project.summary}
              </Typography>
              <Typography sx={{ my: 2, whiteSpace: 'pre-line' }}>{project.description}</Typography>
              <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: 'wrap' }}>
                {project.tags.map((tag) => (
                  <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" />
                ))}
              </Stack>
              {isOwner && (
                <Button
                  component={RouterLink}
                  to={`/projects/${project.id}/edit`}
                  startIcon={<EditIcon />}
                  variant="outlined"
                  sx={{ mt: 3 }}
                >
                  Редактировать
                </Button>
              )}
            </CardContent>
          </Card>

          <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
            Роли в команде
          </Typography>
          {project.roles.length === 0 ? (
            <Typography color="text.secondary">Автор пока не добавил роли</Typography>
          ) : (
            <Stack spacing={2}>
              {project.roles.map((role) => (
                <Card key={role.id}>
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {role.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {role.description}
                      </Typography>
                    </Box>
                    <Chip
                      label={role.isOpen ? 'Ищем' : 'Занята'}
                      color={role.isOpen ? 'success' : 'default'}
                      variant={role.isOpen ? 'filled' : 'outlined'}
                    />
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Хотите в команду?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {openRoles.length
                  ? `Сейчас открыто ролей: ${openRoles.length}. Расскажите о себе в заявке.`
                  : 'Набор в команду сейчас закрыт.'}
              </Typography>
              <Button
                fullWidth
                variant="contained"
                disabled={!openRoles.length || isOwner}
                onClick={() => setDialogOpen(true)}
              >
                Подать заявку
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6">Команда</Typography>
              <List dense>
                {project.members.map((member) => (
                  <ListItem key={member.userId} disableGutters>
                    <ListItemAvatar>
                      <Avatar>{member.fullName[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={member.fullName} secondary={member.roleTitle} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Заявка в проект «{project.title}»</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField select label="Роль" defaultValue={openRoles[0]?.id ?? ''}>
              {openRoles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.title}
                </MenuItem>
              ))}
            </TextField>
            <TextField label="Сопроводительное сообщение" multiline minRows={4} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={() => setDialogOpen(false)}>
            Отправить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
