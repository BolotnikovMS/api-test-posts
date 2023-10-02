import { OrderBy } from 'App/Enums/Sorted'

export interface IQueryParams {
  _page: number
  _size: number
  _sort: string
  _order: OrderBy
}
