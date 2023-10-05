import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

import { DateTime } from 'luxon'
import Post from 'App/Models/Post'
import User from 'App/Models/User'
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
    fields: ['postId'],
    strategy: 'shortId',
  })
  public slug: string

  @column()
  public commentBody: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Post)
  public post: BelongsTo<typeof Post>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
