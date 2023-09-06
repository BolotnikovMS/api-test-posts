import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'

enum orderBy {
  'acs' = 'asc',
  'desc' = 'desc'
}

interface IQueryParams {
  page: number
  size: number
  sort: string
  order: orderBy
}

export default class PostsController {
  public async index({ response, request }: HttpContextContract) {
    try {
      const { page = 1, size = -1, sort, order } = request.qs() as IQueryParams

      const posts = await Post.query()
        .if(sort && order, query => query.orderBy(sort, orderBy[order]))
        .paginate(page, size)

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

  public async show({ response, params }: HttpContextContract) {
    try {
      const post = await Post.findBy('slug', params['post(slug)'])

      if (post) {
        return response.status(200).json(post)
      }

      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      console.log(error)

      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async edit({}: HttpContextContract) {}

  public async update({ request, response, params }: HttpContextContract) {
    try {
      const post = await Post.findBy('slug', params['post(slug)'])

      if (post) {
        const postSchema = schema.create({
          topicId: schema.number.optional(),
          title: schema.string.optional([rules.trim(), rules.minLength(3), rules.maxLength(200), rules.escape()]),
          body: schema.string.optional([rules.trim(), rules.minLength(5), rules.escape()]),
        })
        const messages: CustomMessages = {
          required: 'Поле {{ field }} является обязательным.',
          minLength: 'Минимальная длинна {{ field }} - {{ options.minLength }} символа.',
          maxLength: 'Максимальная длинна {{ field }} - {{ options.maxLength }} символа.',
        }
        const validatedData = await request.validate({ schema: postSchema, messages })
        const updPost = await post.merge(validatedData).save()

        return response.status(200).json(updPost)
      }

      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      console.log(error)

      return response.status(400).json({ error })
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    try {
      const post = await Post.findBy('slug', params['post(slug)'])

      if (post) {
        await post.delete()

        return response.status(204)
      }

      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      console.log(error)

    }
  }
}
