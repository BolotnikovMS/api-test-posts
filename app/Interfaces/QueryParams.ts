import { OrderBy } from 'App/Enums/Sorted'

export interface IQueryParams {
  page: number
  size: number
  sort: string
  order: OrderBy
}
