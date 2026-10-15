export interface UserShort {
  id: number
  username: string
  fullName: string
}

export interface User extends UserShort {
  email: string
  bio: string
  skills: string[]
  isAdmin: boolean
  createdAt: string
}

export interface ProfileInput {
  fullName: string
  bio: string
  skills: string[]
}
