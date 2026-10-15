import { useQuery } from '@tanstack/react-query'
import { tagApi } from '../api/tagApi'

export function useTags() {
  return useQuery({ queryKey: ['tags'], queryFn: tagApi.list, staleTime: 60_000 })
}
