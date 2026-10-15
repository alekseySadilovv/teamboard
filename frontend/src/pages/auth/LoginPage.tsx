import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom'
import { Link } from '@mui/material'
import { useSession } from '../../entities/session'
import { LoginForm } from '../../features/auth'
import { useNotify } from '../../shared/ui'
import { AuthLayout } from './AuthLayout'
import { useRedirectTarget } from './useRedirectTarget'

export function LoginPage() {
  const { status } = useSession()
  const navigate = useNavigate()
  const notify = useNotify()
  const next = useRedirectTarget()

  if (status === 'authenticated') return <Navigate to={next} replace />

  return (
    <AuthLayout
      title="Вход"
      subtitle="Войдите, чтобы размещать идеи и подавать заявки в команды"
      footer={
        <>
          Нет аккаунта?{' '}
          <Link component={RouterLink} to={`/register?next=${encodeURIComponent(next)}`}>
            Зарегистрироваться
          </Link>
        </>
      }
    >
      <LoginForm
        onSuccess={() => {
          notify('Добро пожаловать!')
          navigate(next, { replace: true })
        }}
      />
    </AuthLayout>
  )
}
