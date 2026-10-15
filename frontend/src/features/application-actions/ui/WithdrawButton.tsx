import { useState } from 'react'
import { Button } from '@mui/material'
import { useWithdrawApplication, type Application } from '../../../entities/application'
import { getErrorMessage } from '../../../shared/api'
import { ConfirmDialog, useNotify } from '../../../shared/ui'

export function WithdrawButton({ application }: { application: Application }) {
  const notify = useNotify()
  const withdraw = useWithdrawApplication()
  const [open, setOpen] = useState(false)

  const confirm = () =>
    withdraw.mutate(application.id, {
      onSuccess: () => {
        setOpen(false)
        notify('Заявка отозвана', 'info')
      },
      onError: (error) => {
        setOpen(false)
        notify(getErrorMessage(error), 'error')
      },
    })

  return (
    <>
      <Button color="error" onClick={() => setOpen(true)}>
        Отозвать
      </Button>
      <ConfirmDialog
        open={open}
        title="Отозвать заявку?"
        description={`Заявка на роль «${application.roleTitle}» в проект «${application.projectTitle}» будет удалена.`}
        confirmLabel="Отозвать"
        loading={withdraw.isPending}
        onConfirm={confirm}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
