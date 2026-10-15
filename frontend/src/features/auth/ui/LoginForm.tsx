import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Alert, Button, Collapse, Stack, TextField } from '@mui/material'
import { useSession } from '../../../entities/session'
import { getErrorMessage } from '../../../shared/api'
import { loginSchema, type LoginValues } from '../model/schemas'
import { PasswordField } from './PasswordField'

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { login } = useSession()
  const mutation = useMutation({ mutationFn: login, onSuccess })
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  return (
    <form noValidate onSubmit={handleSubmit((values) => mutation.mutate(values))}>
      <Stack spacing={2}>
        <Collapse in={mutation.isError} unmountOnExit>
          <Alert severity="error">{getErrorMessage(mutation.error)}</Alert>
        </Collapse>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              type="email"
              autoComplete="email"
              autoFocus
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
              autoComplete="current-password"
              fullWidth
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
            />
          )}
        />
        <Button type="submit" variant="contained" size="large" loading={mutation.isPending}>
          Войти
        </Button>
      </Stack>
    </form>
  )
}
