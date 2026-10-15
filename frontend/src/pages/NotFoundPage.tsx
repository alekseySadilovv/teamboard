import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'

export function NotFoundPage() {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h2" color="primary" sx={{ fontWeight: 700 }}>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Страница не найдена
      </Typography>
      <Button component={RouterLink} to="/" variant="contained" sx={{ mt: 2 }}>
        На главную
      </Button>
    </Box>
  )
}
