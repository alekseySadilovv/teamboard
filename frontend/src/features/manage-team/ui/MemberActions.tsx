import { useState } from 'react'
import { IconButton, Tooltip } from '@mui/material'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import LogoutIcon from '@mui/icons-material/Logout'
import { useRemoveMember, type Member, type Project } from '../../../entities/project'
import { getErrorMessage } from '../../../shared/api'
import { ConfirmDialog, useNotify } from '../../../shared/ui'

interface MemberActionsProps {
  project: Project
  member: Member
  currentUserId?: number
  canManage: boolean
}

export function MemberActions({ project, member, currentUserId, canManage }: MemberActionsProps) {
  const notify = useNotify()
  const removeMember = useRemoveMember(project.id)
  const [open, setOpen] = useState(false)

  const isOwnerMember = member.user.id === project.owner.id
  const isSelf = member.user.id === currentUserId
  if (isOwnerMember || (!canManage && !isSelf)) return null

  const confirm = () =>
    removeMember.mutate(member.id, {
      onSuccess: () => {
        setOpen(false)
        notify(isSelf ? 'Вы покинули команду' : `Участник «${member.user.fullName}» исключён из команды`, 'info')
      },
      onError: (error) => {
        setOpen(false)
        notify(getErrorMessage(error), 'error')
      },
    })

  return (
    <>
      <Tooltip title={isSelf ? 'Покинуть команду' : 'Исключить из команды'}>
        <IconButton edge="end" aria-label={isSelf ? 'Покинуть команду' : 'Исключить из команды'} onClick={() => setOpen(true)}>
          {isSelf ? <LogoutIcon fontSize="small" /> : <PersonRemoveIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
      <ConfirmDialog
        open={open}
        title={isSelf ? 'Покинуть команду?' : 'Исключить участника?'}
        description={
          isSelf
            ? `Вы перестанете быть участником проекта «${project.title}», роль «${member.roleTitle}» снова станет открытой.`
            : `${member.user.fullName} будет исключён из команды, роль «${member.roleTitle}» снова станет открытой.`
        }
        confirmLabel={isSelf ? 'Покинуть' : 'Исключить'}
        loading={removeMember.isPending}
        onConfirm={confirm}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
