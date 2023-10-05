import Comment from 'App/Models/Comment'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CommentsController {
  public async index({ response, request }: HttpContextContract) {
    try {
      const comments = await Comment.query()

      return response.status(200).json(comments)
    } catch (error) {
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
