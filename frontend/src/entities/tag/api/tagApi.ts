import { api } from '../../../shared/api'
import type { Tag } from '../model/types'

export const tagApi = {
  list: () => api.get<Tag[]>('/tags'),
}
