import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Autocomplete, Box, Button, Chip, Collapse, Divider, MenuItem, Stack, TextField } from '@mui/material'
import { projectStatusLabels, projectStatuses, useSaveProject, type Project } from '../../../entities/project'
import { useTags } from '../../../entities/tag'
import { getErrorMessage } from '../../../shared/api'
import { applyServerErrors } from '../../../shared/lib/applyServerErrors'
import { projectSchema, toFormValues, toProjectInput, type ProjectFormValues } from '../model/schema'
import { RolesField } from './RolesField'

interface ProjectFormProps {
  project?: Project
  onSaved: (project: Project) => void
  onCancel: () => void
}

export function ProjectForm({ project, onSaved, onCancel }: ProjectFormProps) {
  const { data: tags = [] } = useTags()
  const saveProject = useSaveProject(project?.id)
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: toFormValues(project),
    mode: 'onTouched',
  })

  const summaryLength = useWatch({ control, name: 'summary' }).length

  const onSubmit = handleSubmit((values) =>
    saveProject.mutate(toProjectInput(values), {
      onSuccess: onSaved,
      onError: (error) => applyServerErrors(error, setError),
    }),
  )

  return (
    <Box component="form" noValidate onSubmit={onSubmit}>
      <Stack spacing={3}>
        <Collapse in={saveProject.isError} unmountOnExit>
          <Alert severity="error">{getErrorMessage(saveProject.error)}</Alert>
        </Collapse>

        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <TextField
              {...field}
              label="Название"
              required
              fullWidth
              autoFocus={!project}
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="summary"
          render={({ field }) => (
            <TextField
              {...field}
              label="Краткое описание"
              required
              fullWidth
              error={Boolean(errors.summary)}
              helperText={errors.summary?.message ?? `${summaryLength}/300 — отображается в карточке проекта`}
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <TextField
              {...field}
              label="Подробное описание"
              multiline
              minRows={5}
              fullWidth
              error={Boolean(errors.description)}
              helperText={errors.description?.message ?? 'Цели, текущее состояние, чем будет заниматься команда'}
            />
          )}
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <TextField {...field} select label="Статус" sx={{ minWidth: 200 }}>
                {projectStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {projectStatusLabels[status]}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <Autocomplete
                multiple
                freeSolo
                fullWidth
                options={tags.map((tag) => tag.name)}
                value={field.value}
                onChange={(_, value) => field.onChange(value.map((tag) => tag.trim().toLowerCase().replace(/^#/, '')).filter(Boolean))}
                onBlur={field.onBlur}
                renderValue={(value, getItemProps) =>
                  value.map((option, index) => {
                    const { key, ...itemProps } = getItemProps({ index })
                    const invalid = Array.isArray(errors.tags) && Boolean(errors.tags[index])
                    return <Chip key={key} label={`#${option}`} size="small" color={invalid ? 'error' : 'default'} {...itemProps} />
                  })
                }
                renderInput={(params) => {
                  const tagError = Array.isArray(errors.tags) ? errors.tags.find(Boolean)?.message : errors.tags?.message
                  return (
                    <TextField
                      {...params}
                      label="Теги"
                      error={Boolean(tagError)}
                      helperText={tagError ?? 'Введите тег и нажмите Enter'}
                    />
                  )
                }}
              />
            )}
          />
        </Stack>

        <Divider />
        <RolesField control={control} errors={errors} />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button onClick={onCancel} disabled={saveProject.isPending}>
            Отмена
          </Button>
          <Button type="submit" variant="contained" loading={saveProject.isPending} disabled={Boolean(project) && !isDirty}>
            {project ? 'Сохранить' : 'Опубликовать'}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}
