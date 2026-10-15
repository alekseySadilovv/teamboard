import { useState } from 'react'
import { Link as RouterLink, NavLink, Outlet } from 'react-router-dom'
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import GroupsIcon from '@mui/icons-material/Groups'

const navItems = [
  { to: '/', label: 'Проекты' },
  { to: '/projects/new', label: 'Разместить идею' },
  { to: '/applications', label: 'Заявки' },
  { to: '/profile', label: 'Профиль' },
]

export function Layout() {
  const [open, setOpen] = useState(false)

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <IconButton color="inherit" edge="start" sx={{ mr: 1, display: { md: 'none' } }} onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>
          <GroupsIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ color: 'inherit', textDecoration: 'none', flexGrow: 1, fontWeight: 600 }}
          >
            TeamBoard
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.to}
                component={NavLink}
                to={item.to}
                end
                color="inherit"
                sx={{ '&.active': { bgcolor: 'rgba(255,255,255,0.16)' } }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
          <Button component={RouterLink} to="/login" color="inherit" variant="outlined" sx={{ ml: 2 }}>
            Войти
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer open={open} onClose={() => setOpen(false)}>
        <List sx={{ width: 240 }}>
          {navItems.map((item) => (
            <ListItemButton key={item.to} component={NavLink} to={item.to} end onClick={() => setOpen(false)}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Container component="main" maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        <Outlet />
      </Container>

      <Box component="footer" sx={{ py: 2, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body2">TeamBoard — доска проектов и команд</Typography>
      </Box>
    </Box>
  )
}
