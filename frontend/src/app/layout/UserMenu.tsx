import { useState } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { Box, Button, Divider, IconButton, ListItemIcon, Menu, MenuItem, Skeleton, Typography } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import { useSession } from '../../entities/session'
import { UserAvatar } from '../../entities/user'
import { useNotify } from '../../shared/ui'

export function UserMenu() {
  const { user, status, logout } = useSession()
  const navigate = useNavigate()
  const location = useLocation()
  const notify = useNotify()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  if (status === 'loading') {
    return <Skeleton variant="circular" width={36} height={36} sx={{ ml: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />
  }

  if (!user) {
    return (
      <Button
        component={RouterLink}
        to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`}
        color="inherit"
        variant="outlined"
        sx={{ ml: 2, whiteSpace: 'nowrap' }}
      >
        Войти
      </Button>
    )
  }

  const handleLogout = async () => {
    setAnchor(null)
    await logout()
    notify('Вы вышли из аккаунта', 'info')
    navigate('/')
  }

  return (
    <>
      <IconButton onClick={(e) => setAnchor(e.currentTarget)} sx={{ ml: 2, p: 0.5 }} aria-label="Меню пользователя">
        <UserAvatar user={user} sx={{ width: 36, height: 36, border: '2px solid rgba(255,255,255,0.7)' }} />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography sx={{ fontWeight: 600 }}>{user.fullName}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {user.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem component={RouterLink} to="/profile" onClick={() => setAnchor(null)}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Профиль
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Выйти
        </MenuItem>
      </Menu>
    </>
  )
}
