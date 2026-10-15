import type { ReactNode } from 'react'
import { Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import type { Member } from '../../../entities/project'
import { UserAvatar } from '../../../entities/user'
import { pluralize } from '../../../shared/lib/format'

interface TeamCardProps {
  members: Member[]
  renderActions?: (member: Member) => ReactNode
}

export function TeamCard({ members, renderActions }: TeamCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">
          Команда · {members.length} {pluralize(members.length, ['участник', 'участника', 'участников'])}
        </Typography>
        <List dense>
          {members.map((member) => (
            <ListItem key={member.id} disableGutters secondaryAction={renderActions?.(member)}>
              <ListItemAvatar>
                <UserAvatar user={member.user} />
              </ListItemAvatar>
              <ListItemText primary={member.user.fullName} secondary={member.roleTitle} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}
