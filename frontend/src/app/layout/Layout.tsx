import { useState } from 'react'
import { Link as RouterLink, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  Fade,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import GroupsIcon from '@mui/icons-material/Groups'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AddCircleIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import PersonIcon from '@mui/icons-material/Person'
import { UserMenu } from './UserMenu'

const navItems = [
  { to: '/', label: 'Проекты', icon: <DashboardIcon /> },
  { to: '/projects/new', label: 'Разместить идею', icon: <AddCircleIcon /> },
  { to: '/applications', label: 'Заявки', icon: <InboxIcon /> },
  { to: '/profile', label: 'Профиль', icon: <PersonIcon /> },
]

export function Layout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            aria-label="Открыть меню"
            sx={{ mr: 1, display: { md: 'none' } }}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none', flexGrow: 1 }}>
            <GroupsIcon sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              TeamBoard
            </Typography>
          </Box>
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
          <UserMenu />
        </Toolbar>
      </AppBar>

      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2 }}>
          <GroupsIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            TeamBoard
          </Typography>
        </Box>
        <List sx={{ width: 260 }}>
          {navItems.map((item) => (
            <ListItemButton key={item.to} component={NavLink} to={item.to} end onClick={() => setOpen(false)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Fade in key={location.pathname} timeout={350}>
        <Container component="main" maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
          <Outlet />
        </Container>
      </Fade>

      <Box component="footer" sx={{ py: 2, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body2">TeamBoard — доска проектов и команд</Typography>
      </Box>
    </Box>
  )
}
