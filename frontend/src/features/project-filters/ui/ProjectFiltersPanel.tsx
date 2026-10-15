import { useEffect, useState } from 'react'
import {
  Autocomplete,
  Badge,
  Box,
  Button,
  Chip,
  Collapse,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Switch,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import TuneIcon from '@mui/icons-material/Tune'
import { projectStatusLabels, projectStatuses } from '../../../entities/project'
import { useTags } from '../../../entities/tag'
import type { ProjectFilterValues } from '../model/useProjectFilters'

interface ProjectFiltersPanelProps {
  values: ProjectFilterValues
  isActive: boolean
  onChange: (patch: Partial<ProjectFilterValues>) => void
  onReset: () => void
}

export function ProjectFiltersPanel({ values, isActive, onChange, onReset }: ProjectFiltersPanelProps) {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const [expanded, setExpanded] = useState(false)
  const [search, setSearch] = useState(values.search)
  const [syncedSearch, setSyncedSearch] = useState(values.search)
  const { data: tags = [], isLoading: tagsLoading } = useTags()

  if (values.search !== syncedSearch) {
    setSyncedSearch(values.search)
    if (values.search !== search.trim()) setSearch(values.search)
  }

  useEffect(() => {
    if (search.trim() === values.search) return
    const timer = setTimeout(() => onChange({ search: search.trim() }), 350)
    return () => clearTimeout(timer)
  }, [search, values.search, onChange])

  const extraFiltersCount = values.tags.length + (values.status ? 1 : 0) + (values.onlyRecruiting ? 1 : 0)

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton size="small" aria-label="Очистить поиск" onClick={() => setSearch('')}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        {!isDesktop && (
          <IconButton aria-label="Фильтры" onClick={() => setExpanded((value) => !value)} color={expanded ? 'primary' : 'default'}>
            <Badge badgeContent={extraFiltersCount} color="primary">
              <TuneIcon />
            </Badge>
          </IconButton>
        )}
      </Box>

      <Collapse in={isDesktop || expanded} timeout="auto">
        <Grid container spacing={2} sx={{ alignItems: 'center', mt: 2 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Autocomplete
              multiple
              size="small"
              loading={tagsLoading}
              options={tags.map((tag) => tag.name)}
              value={values.tags}
              onChange={(_, value) => onChange({ tags: value })}
              getOptionLabel={(option) => `#${option}`}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props
                const count = tags.find((tag) => tag.name === option)?.projectCount ?? 0
                return (
                  <li key={key} {...optionProps}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>#{option}</span>
                      <Box component="span" sx={{ color: 'text.secondary' }}>
                        {count}
                      </Box>
                    </Box>
                  </li>
                )
              }}
              renderValue={(value, getItemProps) =>
                value.map((option, index) => {
                  const { key, ...itemProps } = getItemProps({ index })
                  return <Chip key={key} label={`#${option}`} size="small" {...itemProps} />
                })
              }
              renderInput={(params) => <TextField {...params} placeholder={values.tags.length ? '' : 'Теги'} />}
              noOptionsText="Тегов нет"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Статус"
              value={values.status}
              slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
              onChange={(e) => onChange({ status: e.target.value as ProjectFilterValues['status'] })}
            >
              <MenuItem value="">Любой</MenuItem>
              {projectStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {projectStatusLabels[status]}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormControlLabel
              control={
                <Switch checked={values.onlyRecruiting} onChange={(e) => onChange({ onlyRecruiting: e.target.checked })} />
              }
              label="Есть открытые роли"
            />
            <Collapse in={isActive} orientation="horizontal">
              <Button size="small" onClick={onReset} sx={{ whiteSpace: 'nowrap' }}>
                Сбросить
              </Button>
            </Collapse>
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  )
}
