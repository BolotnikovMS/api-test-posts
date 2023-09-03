import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'

export default class PostsController {
  public async index({ response, request }: HttpContextContract) {
    try {
      const { limit, page, size, sortBy } = request.qs()
      console.log(request.qs())

      const posts = await Post.query()
        .if(sortBy, query => query.orderBy(sortBy[0] === '-' ? sortBy.substring(1) : sortBy, sortBy[0] === '-' ? 'desc' : 'asc'))
        //.if(limit, query => query.limit(limit))
        // .if(page && size, query => query.paginate(page, size))
        .paginate(page ? page : 1, size ? size : -1)

      posts.baseUrl('/api/v1/posts')

      posts.queryString({ size })
      posts.toJSON()

      return response.status(200).json(posts)
    } catch (error) {
      console.log(error)

      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async create({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    try {
      const postSchema = schema.create({
        topicId: schema.number(),
        title: schema.string([rules.trim(), rules.minLength(3), rules.maxLength(200), rules.escape()]),
        body: schema.string([rules.trim(), rules.minLength(5), rules.escape()]),
      })
      const messages: CustomMessages = {
        required: 'Поле {{ field }} является обязательным.',
        minLength: 'Минимальная длинна {{ field }} - {{ options.minLength }} символа.',
        maxLength: 'Максимальная длинна {{ field }} - {{ options.maxLength }} символа.',
      }
      const validatedData = await request.validate({ schema: postSchema, messages })
      console.log('validateData: ', validatedData)

      const post = await Post.create({userId: 1, ...validatedData})

      return response.status(201).json(post)
    } catch (error) {
      console.log(error)

      return response.status(400).json({ error })
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
