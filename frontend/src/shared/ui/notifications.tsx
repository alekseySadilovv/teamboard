import { useCallback, useState, type ReactNode } from 'react'
import { Alert, Slide, Snackbar, type AlertColor } from '@mui/material'
import { NotificationsContext, type Notify } from './notificationsContext'

interface Notification {
  key: number
  message: string
  severity: AlertColor
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Notification | null>(null)
  const [open, setOpen] = useState(false)

  const notify = useCallback<Notify>((message, severity = 'success') => {
    setCurrent({ key: Date.now(), message, severity })
    setOpen(true)
  }, [])

  return (
    <NotificationsContext.Provider value={notify}>
      {children}
      <Snackbar
        key={current?.key}
        open={open}
        autoHideDuration={4000}
        onClose={(_, reason) => reason !== 'clickaway' && setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        slots={{ transition: Slide }}
      >
        <Alert severity={current?.severity} variant="filled" onClose={() => setOpen(false)} sx={{ width: '100%' }}>
          {current?.message}
        </Alert>
      </Snackbar>
    </NotificationsContext.Provider>
  )
}
