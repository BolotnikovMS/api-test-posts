import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

import { DateTime } from 'luxon'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public postId: number

  @column()
  @slugify({
    fields: ['id'],
    strategy: 'shortId',
  })
  public slug: string

  @column()
  public commentBody: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
