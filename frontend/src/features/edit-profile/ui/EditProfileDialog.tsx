import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import {
  Alert,
  Autocomplete,
  Button,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material'
import { useSession } from '../../../entities/session'
import { userApi, type User } from '../../../entities/user'
import { getErrorMessage } from '../../../shared/api'
import { applyServerErrors } from '../../../shared/lib/applyServerErrors'
import { SlideUp, useNotify } from '../../../shared/ui'

const schema = z.object({
  fullName: z.string().trim().min(2, 'Минимум 2 символа').max(120, 'Максимум 120 символов'),
  bio: z.string().trim().max(2000, 'Максимум 2000 символов'),
  skills: z.array(z.string().trim().min(1).max(50, 'Навык — максимум 50 символов')).max(20, 'Не более 20 навыков'),
})

type FormValues = z.infer<typeof schema>

interface EditProfileDialogProps {
  user: User
  open: boolean
  onClose: () => void
}

export function EditProfileDialog({ user, open, onClose }: EditProfileDialogProps) {
  const notify = useNotify()
  const { setUser } = useSession()
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: { fullName: user.fullName, bio: user.bio, skills: user.skills },
  })
  const mutation = useMutation({
    mutationFn: userApi.updateMe,
    onSuccess: (updated) => {
      setUser(updated)
      notify('Профиль обновлён')
      onClose()
    },
    onError: (error) => applyServerErrors(error, setError),
  })

  const close = () => {
    if (mutation.isPending) return
    mutation.reset()
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm" slots={{ transition: SlideUp }}>
      <form noValidate onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        <DialogTitle>Редактирование профиля</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Collapse in={mutation.isError} unmountOnExit>
              <Alert severity="error">{getErrorMessage(mutation.error)}</Alert>
            </Collapse>
            <Controller
              control={control}
              name="fullName"
              render={({ field }) => (
                <TextField {...field} label="Имя и фамилия" error={Boolean(errors.fullName)} helperText={errors.fullName?.message} />
              )}
            />
            <Controller
              control={control}
              name="bio"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="О себе"
                  multiline
                  minRows={3}
                  error={Boolean(errors.bio)}
                  helperText={errors.bio?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="skills"
              render={({ field }) => (
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={field.value}
                  onChange={(_, value) => field.onChange(value.map((item) => item.trim()).filter(Boolean))}
                  renderValue={(value, getItemProps) =>
                    value.map((option, index) => {
                      const { key, ...itemProps } = getItemProps({ index })
                      return <Chip key={key} label={option} size="small" {...itemProps} />
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Навыки"
                      error={Boolean(errors.skills)}
                      helperText={errors.skills?.message ?? 'Введите навык и нажмите Enter'}
                    />
                  )}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={close} disabled={mutation.isPending}>
            Отмена
          </Button>
          <Button type="submit" variant="contained" loading={mutation.isPending} disabled={!isDirty}>
            Сохранить
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
