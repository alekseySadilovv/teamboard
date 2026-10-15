import { Avatar, type AvatarProps } from '@mui/material'
import type { UserShort } from '../model/types'

const palette = ['#3949ab', '#00897b', '#8e24aa', '#f4511e', '#6d4c41', '#039be5', '#c0ca33']

export function UserAvatar({ user, sx, ...props }: { user: Pick<UserShort, 'id' | 'fullName'> } & AvatarProps) {
  return (
    <Avatar sx={{ bgcolor: palette[user.id % palette.length], ...sx }} {...props}>
      {user.fullName.trim()[0]?.toUpperCase()}
    </Avatar>
  )
}
