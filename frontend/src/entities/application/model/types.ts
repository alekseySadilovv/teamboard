import type { UserShort } from '../../user'

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected'

export interface Application {
  id: number
  projectId: number
  projectTitle: string
  roleId: number
  roleTitle: string
  user: UserShort
  message: string
  status: ApplicationStatus
  createdAt: string
  updatedAt: string
}

export interface ApplicationInput {
  roleId: number
  message: string
}
