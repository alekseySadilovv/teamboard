import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import { useDeleteProject, type Project } from '../../../entities/project'
import { getErrorMessage } from '../../../shared/api'
import { ConfirmDialog, useNotify } from '../../../shared/ui'

export function DeleteProjectButton({ project }: { project: Project }) {
  const navigate = useNavigate()
  const notify = useNotify()
  const deleteProject = useDeleteProject()
  const [open, setOpen] = useState(false)

  const confirm = () =>
    deleteProject.mutate(project.id, {
      onSuccess: () => {
        notify(`Проект «${project.title}» удалён`, 'info')
        navigate('/', { replace: true })
      },
      onError: (error) => {
        setOpen(false)
        notify(getErrorMessage(error), 'error')
      },
    })

  return (
    <>
      <Button color="error" variant="outlined" startIcon={<DeleteIcon />} onClick={() => setOpen(true)}>
        Удалить
      </Button>
      <ConfirmDialog
        open={open}
        title="Удалить проект?"
        description="Проект, его роли, команда и все заявки будут удалены без возможности восстановления."
        confirmLabel="Удалить"
        loading={deleteProject.isPending}
        onConfirm={confirm}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
