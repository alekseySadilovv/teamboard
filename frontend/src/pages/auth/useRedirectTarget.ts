import { useSearchParams } from 'react-router-dom'

export function useRedirectTarget(): string {
  const [params] = useSearchParams()
  const next = params.get('next')
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/'
}
