import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Card, CardActions, CardContent, Chip, Link, Stack, Tab, Tabs, Typography } from '@mui/material'
import { applicationStatusLabels, incomingApplications, myApplications, type Application } from '../data/mock'

const statusColors = { pending: 'warning', accepted: 'success', rejected: 'error' } as const

function ApplicationCard({ application, incoming }: { application: Application; incoming: boolean }) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 1, flexWrap: 'wrap' }}>
          <Link component={RouterLink} to={`/projects/${application.projectId}`} variant="h6" underline="hover">
            {application.projectTitle}
          </Link>
          <Chip
            size="small"
            label={applicationStatusLabels[application.status]}
            color={statusColors[application.status]}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Роль: {application.roleTitle} · {application.createdAt}
          {incoming && ` · от ${application.applicantName}`}
        </Typography>
        <Typography>{application.message}</Typography>
      </CardContent>
      {incoming && application.status === 'pending' && (
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button variant="contained" color="success">
            Принять
          </Button>
          <Button color="error">Отклонить</Button>
        </CardActions>
      )}
      {!incoming && application.status === 'pending' && (
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button color="error">Отозвать</Button>
        </CardActions>
      )}
    </Card>
  )
}

export function ApplicationsPage() {
  const [tab, setTab] = useState(0)
  const list = tab === 0 ? myApplications : incomingApplications

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Заявки
      </Typography>
      <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 3 }}>
        <Tab label={`Мои заявки (${myApplications.length})`} />
        <Tab label={`Входящие (${incomingApplications.length})`} />
      </Tabs>
      <Stack spacing={2}>
        {list.map((application) => (
          <ApplicationCard key={application.id} application={application} incoming={tab === 1} />
        ))}
      </Stack>
    </>
  )
}
