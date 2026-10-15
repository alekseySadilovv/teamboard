import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Alert,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import { useCreateApplication } from '../../../entities/application'
import type { Project } from '../../../entities/project'
import { getErrorMessage } from '../../../shared/api'
import { SlideUp, useNotify } from '../../../shared/ui'

const schema = z.object({
  roleId: z.number({ error: 'Выберите роль' }).int().positive('Выберите роль'),
  message: z
    .string()
    .trim()
    .min(20, 'Расскажите о себе подробнее — минимум 20 символов')
    .max(2000, 'Сообщение — максимум 2000 символов'),
})

type FormValues = z.infer<typeof schema>

interface ApplyDialogProps {
  project: Project
  open: boolean
  initialRoleId?: number
  onClose: () => void
}

export function ApplyDialog({ project, open, initialRoleId, onClose }: ApplyDialogProps) {
  const notify = useNotify()
  const createApplication = useCreateApplication()
  const openRoles = project.roles.filter((role) => role.isOpen)
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: { roleId: initialRoleId ?? openRoles[0]?.id ?? 0, message: '' },
    mode: 'onTouched',
  })

  const messageLength = useWatch({ control, name: 'message' }).length

  const close = () => {
    if (createApplication.isPending) return
    createApplication.reset()
    reset()
    onClose()
  }

  const onSubmit = handleSubmit((values) =>
    createApplication.mutate(values, {
      onSuccess: () => {
        notify('Заявка отправлена автору проекта')
        close()
      },
    }),
  )

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm" slots={{ transition: SlideUp }}>
      <form noValidate onSubmit={onSubmit}>
        <DialogTitle>Заявка в проект «{project.title}»</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Collapse in={createApplication.isError} unmountOnExit>
              <Alert severity="error">{getErrorMessage(createApplication.error)}</Alert>
            </Collapse>
            <Controller
              control={control}
              name="roleId"
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Роль"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  error={Boolean(errors.roleId)}
                  helperText={errors.roleId?.message}
                >
                  {openRoles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.title}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              control={control}
              name="message"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Сопроводительное сообщение"
                  placeholder="Опыт, навыки, сколько времени готовы уделять проекту"
                  multiline
                  minRows={4}
                  error={Boolean(errors.message)}
                  helperText={errors.message?.message ?? `${messageLength}/2000`}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={close} disabled={createApplication.isPending}>
            Отмена
          </Button>
          <Button type="submit" variant="contained" loading={createApplication.isPending}>
            Отправить
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
