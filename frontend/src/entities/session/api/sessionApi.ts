import { api } from '../../../shared/api'
import type { AuthResponse, LoginInput, RegisterInput } from '../model/types'

export const sessionApi = {
  login: (input: LoginInput) => api.post<AuthResponse>('/auth/login', input),
  register: (input: RegisterInput) => api.post<AuthResponse>('/auth/register', input),
  logout: () => api.post<void>('/auth/logout'),
}
