import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Card, CardContent, Link, Stack, TextField, Typography } from '@mui/material'

export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const isLogin = mode === 'login'

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto', mt: { xs: 2, md: 6 } }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            {isLogin ? 'Вход' : 'Регистрация'}
          </Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mb: 3 }}>
            {isLogin ? 'Войдите, чтобы размещать идеи и подавать заявки' : 'Создайте аккаунт, чтобы находить команду'}
          </Typography>
          <Stack spacing={2}>
            {!isLogin && <TextField label="Имя и фамилия" fullWidth />}
            {!isLogin && <TextField label="Имя пользователя" fullWidth />}
            <TextField label="Email" type="email" fullWidth />
            <TextField label="Пароль" type="password" fullWidth />
            <Button variant="contained" size="large">
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </Button>
          </Stack>
          <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
            {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
            <Link component={RouterLink} to={isLogin ? '/register' : '/login'}>
              {isLogin ? 'Зарегистрироваться' : 'Войти'}
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
