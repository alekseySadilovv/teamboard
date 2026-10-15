import { httpRequest } from './http'
import { handleMockRequest } from './mock/server'
import type { RequestOptions } from './types'

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

const REAL_API_PATHS = [/^\/auth\//, /^\/users\/me$/]

export function request<T>(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<T> {
  if (REAL_API_PATHS.some((pattern) => pattern.test(path))) {
    return httpRequest<T>(method, path, options)
  }
  return handleMockRequest(method, path, options) as Promise<T>
}

export const api = {
  get: <T>(path: string, params?: RequestOptions['params']) => request<T>('GET', path, { params }),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, { body }),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, { body }),
  delete: (path: string) => request<void>('DELETE', path),
}
