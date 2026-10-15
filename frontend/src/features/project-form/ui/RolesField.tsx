import { Controller, useFieldArray, type Control, type FieldErrors } from 'react-hook-form'
import { TransitionGroup } from 'react-transition-group'
import { Box, Button, Collapse, FormControlLabel, IconButton, Paper, Stack, Switch, TextField, Tooltip, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import { emptyRole, type ProjectFormValues } from '../model/schema'

interface RolesFieldProps {
  control: Control<ProjectFormValues>
  errors: FieldErrors<ProjectFormValues>
}

export function RolesField({ control, errors }: RolesFieldProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'roles', keyName: 'key' })

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box>
          <Typography variant="h6">Роли в команде</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Отметьте «Ищем», если роль открыта для заявок
          </Typography>
        </Box>
      </Box>

      {fields.length === 0 && (
        <Typography sx={{ color: 'text.secondary', py: 2 }}>
          Роли не добавлены — заявки в проект подать будет нельзя
        </Typography>
      )}

      <TransitionGroup>
        {fields.map((field, index) => (
          <Collapse key={field.key}>
            <Paper variant="outlined" sx={{ p: 2, mb: 1.5 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'flex-start' } }}>
                <Controller
                  control={control}
                  name={`roles.${index}.title`}
                  render={({ field: input }) => (
                    <TextField
                      {...input}
                      label="Роль"
                      size="small"
                      sx={{ flex: 1 }}
                      error={Boolean(errors.roles?.[index]?.title)}
                      helperText={errors.roles?.[index]?.title?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`roles.${index}.description`}
                  render={({ field: input }) => (
                    <TextField
                      {...input}
                      label="Требования"
                      size="small"
                      sx={{ flex: 2 }}
                      error={Boolean(errors.roles?.[index]?.description)}
                      helperText={errors.roles?.[index]?.description?.message}
                    />
                  )}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Controller
                    control={control}
                    name={`roles.${index}.isOpen`}
                    render={({ field: input }) => (
                      <FormControlLabel
                        control={<Switch checked={input.value} onChange={(e) => input.onChange(e.target.checked)} />}
                        label="Ищем"
                      />
                    )}
                  />
                  <Tooltip title="Удалить роль">
                    <IconButton aria-label="Удалить роль" onClick={() => remove(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Stack>
            </Paper>
          </Collapse>
        ))}
      </TransitionGroup>

      {errors.roles?.root?.message && (
        <Typography variant="body2" sx={{ color: 'error.main' }}>
          {errors.roles.root.message}
        </Typography>
      )}

      <Button startIcon={<AddIcon />} onClick={() => append({ ...emptyRole })} disabled={fields.length >= 20}>
        Добавить роль
      </Button>
    </Box>
  )
}
