import { useState } from 'react'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'
import { TransitionGroup } from 'react-transition-group'
import { Badge, Box, Button, Chip, Collapse, Stack, Tab, Tabs } from '@mui/material'
import {
  ApplicationCard,
  useIncomingApplications,
  useMyApplications,
  type Application,
  type ApplicationStatus,
} from '../../entities/application'
import { DecisionButtons, WithdrawButton } from '../../features/application-actions'
import { EmptyState, ErrorState, LoadingState, PageHeader } from '../../shared/ui'

type Tab = 'my' | 'incoming'
type StatusFilter = ApplicationStatus | 'all'

const filters: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'pending', label: 'На рассмотрении' },
  { value: 'accepted', label: 'Принятые' },
  { value: 'rejected', label: 'Отклонённые' },
]

export function ApplicationsPage() {
  const [params, setParams] = useSearchParams()
  const tab: Tab = params.get('tab') === 'incoming' ? 'incoming' : 'my'
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const mine = useMyApplications()
  const incoming = useIncomingApplications()
  const query = tab === 'my' ? mine : incoming

  const pendingIncoming = incoming.data?.filter((item) => item.status === 'pending').length ?? 0
  const items = (query.data ?? []).filter((item) => statusFilter === 'all' || item.status === statusFilter)

  const renderActions = (application: Application) => {
    if (application.status !== 'pending') return undefined
    return tab === 'incoming' ? <DecisionButtons application={application} /> : <WithdrawButton application={application} />
  }

  return (
    <>
      <PageHeader title="Заявки" subtitle="Ваши отклики на проекты и заявки в ваши команды" />
      <Tabs
        value={tab}
        onChange={(_, value: Tab) => {
          setParams(value === 'incoming' ? { tab: 'incoming' } : {}, { replace: true })
          setStatusFilter('all')
        }}
        sx={{ mb: 2 }}
      >
        <Tab value="my" label={`Мои заявки${mine.data ? ` (${mine.data.length})` : ''}`} />
        <Tab
          value="incoming"
          label={
            <Badge badgeContent={pendingIncoming} color="error" sx={{ '& .MuiBadge-badge': { right: -12 } }}>
              Входящие
            </Badge>
          }
        />
      </Tabs>

      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mb: 3 }}>
        {filters.map((filter) => (
          <Chip
            key={filter.value}
            label={filter.label}
            color={statusFilter === filter.value ? 'primary' : 'default'}
            variant={statusFilter === filter.value ? 'filled' : 'outlined'}
            onClick={() => setStatusFilter(filter.value)}
          />
        ))}
      </Stack>

      {query.isPending ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState error={query.error} onRetry={() => query.refetch()} />
      ) : items.length === 0 ? (
        <EmptyState
          title={statusFilter !== 'all' ? 'Нет заявок с таким статусом' : tab === 'my' ? 'Вы ещё не подавали заявок' : 'Входящих заявок нет'}
          description={
            tab === 'my' ? 'Найдите интересный проект и откликнитесь на открытую роль' : 'Когда кто-то откликнется на роль в вашем проекте, заявка появится здесь'
          }
          action={
            tab === 'my' && statusFilter === 'all' ? (
              <Button component={RouterLink} to="/?open=1" variant="contained">
                Найти проект
              </Button>
            ) : undefined
          }
        />
      ) : (
        <Box>
          <TransitionGroup>
            {items.map((application) => (
              <Collapse key={application.id}>
                <Box sx={{ mb: 2 }}>
                  <ApplicationCard application={application} showApplicant={tab === 'incoming'} actions={renderActions(application)} />
                </Box>
              </Collapse>
            ))}
          </TransitionGroup>
        </Box>
      )}
    </>
  )
}
