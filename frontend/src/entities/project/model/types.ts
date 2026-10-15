import type { UserShort } from '../../user'

export type ProjectStatus = 'idea' | 'recruiting' | 'in_progress' | 'completed'

export interface Role {
  id: number
  title: string
  description: string
  isOpen: boolean
}

export interface Member {
  id: number
  user: UserShort
  roleTitle: string
  joinedAt: string
}

export interface Project {
  id: number
  title: string
  summary: string
  description: string
  status: ProjectStatus
  tags: string[]
  owner: UserShort
  roles: Role[]
  members: Member[]
  openRolesCount: number
  createdAt: string
  updatedAt: string
}

export interface ProjectFilters {
  search?: string
  tags?: string[]
  status?: ProjectStatus
  hasOpenRoles?: boolean
  ownerId?: number
  memberId?: number
  limit?: number
  offset?: number
}

export interface RoleInput {
  id?: number
  title: string
  description: string
  isOpen: boolean
}

export interface ProjectInput {
  title: string
  summary: string
  description: string
  status: ProjectStatus
  tags: string[]
  roles: RoleInput[]
}
