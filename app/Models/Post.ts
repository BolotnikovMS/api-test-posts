import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'

import Comment from 'App/Models/Comment'
import { DateTime } from 'luxon'
import User from 'App/Models/User'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public topicId: number

  @column()
  @slugify({
    fields: ['title'],
    strategy: 'shortId',
  })
  public slug: string

  @column({
    consume: (value: string): boolean => Boolean(value),
  })
  public published: boolean

  @column()
  public title: string

  @column()
  public body: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>
}
