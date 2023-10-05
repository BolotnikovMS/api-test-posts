import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'

import Comment from 'App/Models/Comment'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import { OrderBy } from 'App/Enums/Sorted'
import Post from 'App/Models/Post'

export default class PostsController {
  public async index({ response, request }: HttpContextContract) {
    try {
      const { page, size, sort, order, search } = request.qs() as IQueryParams

      const posts = await Post.query()
        .if(sort && order, query => query.orderBy(sort, OrderBy[order]))
        .if(search, query => {
          query.where(queryS => {
            queryS.whereLike('title', `%${search}%`)
          })
          .orWhere(queryS => {
            queryS.whereLike('body', `%${search}%`)
          })
        })
        .preload('user')
        .paginate(page, size)

      posts.baseUrl('/api/v1/posts')
      posts.queryString({ size, sort, order })
      posts.toJSON()

      return response.status(200).json(posts)
    } catch (error) {
      console.log(error)

      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
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

      const post = await Post.create({userId: auth.user?.id, ...validatedData})

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
        await post.load('user')

        return response.status(200).json(post)
      }

      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      console.log(error)

      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async getComments({ request, response, params }: HttpContextContract) {
    try {
      const post = await Post.findBy('slug', params['post(slug)'])

      if (post) {
        const { page, size } = request.qs() as IQueryParams
        const comments = await Comment
          .query()
          .where('id', '=', post.id)
          .paginate(page, size)

        comments.baseUrl(`/api/v1/posts/${post.slug}/comments`)
        comments.queryString({ size })
        comments.toJSON()

        return response.status(200).json(comments)
      }

      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      console.log(error);

      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

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
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }
}
