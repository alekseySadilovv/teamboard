import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom'
import { Link } from '@mui/material'
import { useSession } from '../../entities/session'
import { RegisterForm } from '../../features/auth'
import { useNotify } from '../../shared/ui'
import { AuthLayout } from './AuthLayout'
import { useRedirectTarget } from './useRedirectTarget'

export function RegisterPage() {
  const { status } = useSession()
  const navigate = useNavigate()
  const notify = useNotify()
  const next = useRedirectTarget()

  if (status === 'authenticated') return <Navigate to={next} replace />

  return (
    <AuthLayout
      title="Регистрация"
      subtitle="Создайте аккаунт, чтобы находить команду для своих идей"
      footer={
        <>
          Уже есть аккаунт?{' '}
          <Link component={RouterLink} to={`/login?next=${encodeURIComponent(next)}`}>
            Войти
          </Link>
        </>
      }
    >
      <RegisterForm
        onSuccess={() => {
          notify('Аккаунт создан')
          navigate(next, { replace: true })
        }}
      />
    </AuthLayout>
  )
}
