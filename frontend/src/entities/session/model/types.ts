import type { User } from '../../user'

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  username: string
  email: string
  fullName: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  user: User
}

export type SessionStatus = 'loading' | 'authenticated' | 'anonymous'
