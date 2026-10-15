import { useParams, useNavigate } from 'react-router-dom'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { projects, statusLabels, tags } from '../data/mock'

export function ProjectFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = id ? projects.find((item) => item.id === Number(id)) : undefined
  const isEdit = Boolean(project)

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Редактирование проекта' : 'Новая идея'}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Опишите проект и укажите, какие роли нужны команде
      </Typography>

      <Card>
        <CardContent>
          <Stack spacing={3}>
            <TextField label="Название" defaultValue={project?.title} fullWidth />
            <TextField label="Краткое описание" defaultValue={project?.summary} fullWidth />
            <TextField label="Подробное описание" defaultValue={project?.description} multiline minRows={5} fullWidth />
            <TextField select label="Статус" defaultValue={project?.status ?? 'recruiting'} fullWidth>
              {Object.entries(statusLabels).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
            <Autocomplete
              multiple
              freeSolo
              options={tags}
              defaultValue={project?.tags ?? []}
              renderValue={(value, getItemProps) =>
                value.map((option, index) => {
                  const { key, ...itemProps } = getItemProps({ index })
                  return <Chip key={key} label={`#${option}`} size="small" {...itemProps} />
                })
              }
              renderInput={(params) => <TextField {...params} label="Теги" />}
            />

            <Divider />
            <Typography variant="h6">Роли</Typography>
            {(project?.roles.length ? project.roles : [{ id: 0, title: '', description: '', isOpen: true }]).map(
              (role) => (
                <Stack key={role.id} direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' } }}>
                  <TextField label="Роль" defaultValue={role.title} sx={{ flex: 1 }} />
                  <TextField label="Требования" defaultValue={role.description} sx={{ flex: 2 }} />
                  <FormControlLabel control={<Switch defaultChecked={role.isOpen} />} label="Ищем" />
                  <IconButton aria-label="Удалить роль">
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              ),
            )}
            <Button startIcon={<AddIcon />} sx={{ alignSelf: 'flex-start' }}>
              Добавить роль
            </Button>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={() => navigate(-1)}>Отмена</Button>
              <Button variant="contained" onClick={() => navigate(project ? `/projects/${project.id}` : '/')}>
                {isEdit ? 'Сохранить' : 'Опубликовать'}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
