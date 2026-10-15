import type { ReactNode } from 'react'
import { Box, Card, CardContent, Grow, Typography } from '@mui/material'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <Grow in>
      <Box sx={{ maxWidth: 440, mx: 'auto', mt: { xs: 1, md: 4 } }}>
        <Card>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography variant="h5" component="h1" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              {subtitle}
            </Typography>
            {children}
            <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
              {footer}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Grow>
  )
}
