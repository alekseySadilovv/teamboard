import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Typography, Zoom } from '@mui/material'

export function NotFoundPage() {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Zoom in>
        <Typography variant="h1" sx={{ color: 'primary.main', fontWeight: 700 }}>
          404
        </Typography>
      </Zoom>
      <Typography variant="h5" gutterBottom>
        Страница не найдена
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>Проверьте адрес или вернитесь к списку проектов</Typography>
      <Button component={RouterLink} to="/" variant="contained" sx={{ mt: 3 }}>
        На главную
      </Button>
    </Box>
  )
}
