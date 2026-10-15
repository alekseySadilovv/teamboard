import { api } from '../../../shared/api'
import type { ProfileInput, User } from '../model/types'

export const userApi = {
  me: () => api.get<User>('/users/me'),
  updateMe: (input: ProfileInput) => api.patch<User>('/users/me', input),
}
