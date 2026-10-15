export interface Page<T> {
  items: T[]
  total: number
}

export type QueryParams = Record<string, string | number | boolean | string[] | undefined | null>

export interface RequestOptions {
  params?: QueryParams
  body?: unknown
}
