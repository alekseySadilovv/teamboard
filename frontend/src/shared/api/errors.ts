export interface FieldError {
  field: string
  message: string
}

export class ApiError extends Error {
  status: number
  fieldErrors: FieldError[]

  constructor(status: number, message: string, fieldErrors: FieldError[] = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 0 || error.status >= 500) {
      return 'Сервер недоступен или временно не отвечает. Попробуйте ещё раз'
    }
    if (error.status === 403) return error.message || 'Недостаточно прав для этого действия'
    return error.message
  }
  if (error instanceof Error) return error.message
  return 'Что-то пошло не так'
}
