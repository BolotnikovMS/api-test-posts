import { BaseModel, HasMany, HasOne, beforeSave, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'

import Comment from 'App/Models/Comment'
import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import Post from 'App/Models/Post'
import Role from 'App/Models/Role'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({
    consume: (value: string): boolean => Boolean(value),
  })
  public blocked: boolean

  @column()
  public surname: string

  @column()
  public name: string

  @column()
  public patronymic: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column()
  public roleId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasOne(() => Role)
  public role: HasOne<typeof Role>

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>
}
