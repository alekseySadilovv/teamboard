import { ApiError, type FieldError } from './errors'
import { tokenStore } from './tokenStore'
import type { QueryParams, RequestOptions } from './types'

const API_URL = import.meta.env.VITE_API_URL ?? '/api'
const REFRESH_PATH = '/auth/refresh'
const PUBLIC_AUTH_PATHS = ['/auth/login', '/auth/register', REFRESH_PATH]

type UnauthorizedListener = () => void
let onUnauthorized: UnauthorizedListener | null = null
let refreshPromise: Promise<boolean> | null = null

export function setUnauthorizedListener(listener: UnauthorizedListener | null) {
  onUnauthorized = listener
}

function buildUrl(path: string, params?: QueryParams): string {
  const search = new URLSearchParams()
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    if (Array.isArray(value)) value.forEach((item) => search.append(key, item))
    else search.append(key, String(value))
  })
  const query = search.toString()
  return `${API_URL}${path}${query ? `?${query}` : ''}`
}

async function parseError(response: Response): Promise<ApiError> {
  let detail = response.statusText || 'Ошибка запроса'
  let fieldErrors: FieldError[] = []
  try {
    const body = await response.json()
    if (typeof body.detail === 'string') detail = body.detail
    if (Array.isArray(body.errors)) fieldErrors = body.errors
  } catch {
    // тело ответа не JSON — используем текст статуса
  }
  return new ApiError(response.status, detail, fieldErrors)
}

async function send(method: string, path: string, options: RequestOptions): Promise<Response> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  const token = tokenStore.get()
  if (token) headers.Authorization = `Bearer ${token}`
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  try {
    return await fetch(buildUrl(path, options.params), {
      method,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      credentials: 'include',
    })
  } catch {
    throw new ApiError(0, 'Сервер недоступен')
  }
}

export function refreshAccessToken(): Promise<boolean> {
  refreshPromise ??= send('POST', REFRESH_PATH, {})
    .then(async (response) => {
      if (!response.ok) {
        tokenStore.set(null)
        return false
      }
      const body = await response.json()
      tokenStore.set(body.accessToken)
      return true
    })
    .catch(() => false)
    .finally(() => {
      refreshPromise = null
    })
  return refreshPromise
}

export async function httpRequest<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
  let response = await send(method, path, options)

  if (response.status === 401 && !PUBLIC_AUTH_PATHS.includes(path)) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      response = await send(method, path, options)
    } else {
      onUnauthorized?.()
    }
  }

  if (!response.ok) throw await parseError(response)
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}
