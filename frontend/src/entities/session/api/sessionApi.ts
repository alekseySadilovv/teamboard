import { api, tokenStore } from '../../../shared/api'
import type { AuthResponse, LoginInput, RegisterInput } from '../model/types'

async function authenticate(path: string, input: LoginInput | RegisterInput) {
  const response = await api.post<AuthResponse>(path, input)
  tokenStore.set(response.accessToken)
  return response
}

export const sessionApi = {
  login: (input: LoginInput) => authenticate('/auth/login', input),
  register: (input: RegisterInput) => authenticate('/auth/register', input),
  logout: async () => {
    try {
      await api.post<void>('/auth/logout')
    } finally {
      tokenStore.set(null)
    }
  },
}
