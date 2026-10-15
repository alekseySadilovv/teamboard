import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { ApiError } from '../api/errors'

export function applyServerErrors<T extends FieldValues>(error: unknown, setError: UseFormSetError<T>): boolean {
  if (!(error instanceof ApiError) || error.fieldErrors.length === 0) return false
  error.fieldErrors.forEach(({ field, message }) => setError(field as Path<T>, { type: 'server', message }))
  return true
}
