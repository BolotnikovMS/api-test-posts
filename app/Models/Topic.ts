import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'

import { DateTime } from 'luxon'
import Post from './Post'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'

export default class Topic extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public name: string

  @column()
  @slugify({
    fields: ['name'],
    strategy: 'shortId',
  })
  public slug: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>
}
