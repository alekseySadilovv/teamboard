import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Alert, Button, Collapse, Stack, TextField } from '@mui/material'
import { useSession } from '../../../entities/session'
import { getErrorMessage } from '../../../shared/api'
import { applyServerErrors } from '../../../shared/lib/applyServerErrors'
import { registerSchema, type RegisterValues } from '../model/schemas'
import { PasswordField } from './PasswordField'

export function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const { register } = useSession()
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', username: '', email: '', password: '', confirmPassword: '' },
  })
  const mutation = useMutation({
    mutationFn: ({ confirmPassword: _confirm, ...values }: RegisterValues) => register(values),
    onSuccess,
    onError: (error) => applyServerErrors(error, setError),
  })

  return (
    <form noValidate onSubmit={handleSubmit((values) => mutation.mutate(values))}>
      <Stack spacing={2}>
        <Collapse in={mutation.isError} unmountOnExit>
          <Alert severity="error">{getErrorMessage(mutation.error)}</Alert>
        </Collapse>
        <Controller
          control={control}
          name="fullName"
          render={({ field }) => (
            <TextField
              {...field}
              label="Имя и фамилия"
              autoComplete="name"
              autoFocus
              fullWidth
              error={Boolean(errors.fullName)}
              helperText={errors.fullName?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="username"
          render={({ field }) => (
            <TextField
              {...field}
              label="Имя пользователя"
              autoComplete="username"
              fullWidth
              error={Boolean(errors.username)}
              helperText={errors.username?.message ?? 'Латинские буквы, цифры и _'}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              type="email"
              autoComplete="email"
              fullWidth
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <PasswordField
              {...field}
              label="Пароль"
              autoComplete="new-password"
              fullWidth
              error={Boolean(errors.password)}
              helperText={errors.password?.message ?? 'Не менее 8 символов, буквы и цифры'}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <PasswordField
              {...field}
              label="Повторите пароль"
              autoComplete="new-password"
              fullWidth
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword?.message}
            />
          )}
        />
        <Button type="submit" variant="contained" size="large" loading={mutation.isPending}>
          Зарегистрироваться
        </Button>
      </Stack>
    </form>
  )
}
