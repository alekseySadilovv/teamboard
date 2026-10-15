import { httpRequest } from './http'
import type { RequestOptions } from './types'

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

export function request<T>(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<T> {
  return httpRequest<T>(method, path, options)
}

export const api = {
  get: <T>(path: string, params?: RequestOptions['params']) => request<T>('GET', path, { params }),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, { body }),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, { body }),
  delete: (path: string) => request<void>('DELETE', path),
}
