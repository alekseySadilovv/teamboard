import { Button } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { useDecideApplication, type Application } from '../../../entities/application'
import { getErrorMessage } from '../../../shared/api'
import { useNotify } from '../../../shared/ui'

export function DecisionButtons({ application }: { application: Application }) {
  const notify = useNotify()
  const decide = useDecideApplication()
  const pendingStatus = decide.isPending ? decide.variables?.status : undefined

  const submit = (status: 'accepted' | 'rejected') =>
    decide.mutate(
      { id: application.id, status },
      {
        onSuccess: () =>
          notify(
            status === 'accepted'
              ? `${application.user.fullName} теперь в команде`
              : 'Заявка отклонена',
            status === 'accepted' ? 'success' : 'info',
          ),
        onError: (error) => notify(getErrorMessage(error), 'error'),
      },
    )

  return (
    <>
      <Button
        variant="contained"
        color="success"
        startIcon={<CheckIcon />}
        loading={pendingStatus === 'accepted'}
        disabled={decide.isPending}
        onClick={() => submit('accepted')}
      >
        Принять
      </Button>
      <Button
        color="error"
        startIcon={<CloseIcon />}
        loading={pendingStatus === 'rejected'}
        disabled={decide.isPending}
        onClick={() => submit('rejected')}
      >
        Отклонить
      </Button>
    </>
  )
}
