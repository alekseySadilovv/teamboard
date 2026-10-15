import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControlLabel,
  Grid,
  InputAdornment,
  Paper,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import { ProjectCard } from '../components/ProjectCard'
import { projects, tags } from '../data/mock'

export function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [onlyRecruiting, setOnlyRecruiting] = useState(false)

  const query = search.trim().toLowerCase()
  const filtered = projects.filter((project) => {
    const matchesText =
      !query || project.title.toLowerCase().includes(query) || project.summary.toLowerCase().includes(query)
    const matchesTags = selectedTags.every((tag) => project.tags.includes(tag))
    const matchesStatus = !onlyRecruiting || project.status === 'recruiting'
    return matchesText && matchesTags && matchesStatus
  })

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4">Проекты</Typography>
          <Typography color="text.secondary">Найдите команду для своей идеи или присоединитесь к чужой</Typography>
        </Box>
        <Button component={RouterLink} to="/projects/new" variant="contained" startIcon={<AddIcon />}>
          Разместить идею
        </Button>
      </Box>

      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Поиск по названию и описанию"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Autocomplete
              multiple
              size="small"
              options={tags}
              value={selectedTags}
              onChange={(_, value) => setSelectedTags(value)}
              renderValue={(value, getItemProps) =>
                value.map((option, index) => {
                  const { key, ...itemProps } = getItemProps({ index })
                  return <Chip key={key} label={`#${option}`} size="small" {...itemProps} />
                })
              }
              renderInput={(params) => <TextField {...params} placeholder="Теги" />}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControlLabel
              control={<Switch checked={onlyRecruiting} onChange={(e) => setOnlyRecruiting(e.target.checked)} />}
              label="Только «Ищем роли»"
            />
          </Grid>
        </Grid>
      </Paper>

      {filtered.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
          Проекты не найдены
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((project) => (
            <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <ProjectCard project={project} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  )
}
