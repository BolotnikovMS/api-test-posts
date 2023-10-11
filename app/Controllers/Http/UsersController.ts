import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import { OrderBy } from 'App/Enums/Sorted'
import Post from 'App/Models/Post'
import User from 'App/Models/User'

export default class UsersController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const { page, size, sort, order } = request.qs() as IQueryParams
      const users = await User
        .query()
        .if(sort && order, query => query.orderBy(sort, OrderBy[order]))
        .if(page && size, query => query.paginate(page, size))

      const total = (await User.query().count('* as total'))[0].$extras.total

      return response.status(200).json({meta: {total}, data: users})
    } catch (error) {
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async store({}: HttpContextContract) {}

  public async show({ response, params }: HttpContextContract) {
    try {
      const user = await User.find(params.id)

      if (user) {
        return response.status(200).json(user)
      }

      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async getUserPosts({ request, response, params }: HttpContextContract) {
    try {
      const { page, size } = request.qs() as IQueryParams
      const user = await User.find(params.id)

      if (user) {
        const posts = await Post
          .query()
          .where('user_id', '=', user.id)
          .if(page && size, query => query.paginate(page, size))

        const total = (await User.query().where('id', '=', params.id).withCount('posts', query => {
          query.as('total')
        }))[0].$extras.total

        return response.status(200).json({meta: {total}, data: posts})
      }

      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
