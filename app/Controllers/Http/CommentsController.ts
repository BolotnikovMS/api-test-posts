import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'

import Comment from 'App/Models/Comment'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CommentsController {
  public async index({ response }: HttpContextContract) {
    try {
      const comments = await Comment.query()

      return response.status(200).json(comments)
    } catch (error) {
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const commentSchema = schema.create({
        postId: schema.number(),
        commentBody: schema.string([rules.trim(), rules.minLength(3), rules.maxLength(200)])
      })
      const messages: CustomMessages = {
        required: 'Поле {{ field }} является обязательным.',
        minLength: 'Минимальная длинна {{ field }} - {{ options.minLength }} символа.',
        maxLength: 'Максимальная длинна {{ field }} - {{ options.maxLength }} символа.',
      }
      const validatedData = await request.validate({ schema: commentSchema, messages })
      const comment = await Comment.create({userId: auth.user?.id, ...validatedData})

      return response.status(201).json(comment)
    } catch (error) {
      return response.status(400).json(error.messages.errors[0])
    }
  }

  public async show({}: HttpContextContract) {}

  public async update({ request, response, params }: HttpContextContract) {
    try {
      const comment = await Comment.findBy('slug', params['comment(slug)'])

      if (comment) {
        const commentSchema = schema.create({
          commentBody: schema.string([rules.trim(), rules.minLength(3), rules.maxLength(200)])
        })
        const messages: CustomMessages = {
          required: 'Поле {{ field }} является обязательным.',
          minLength: 'Минимальная длинна {{ field }} - {{ options.minLength }} символа.',
          maxLength: 'Максимальная длинна {{ field }} - {{ options.maxLength }} символа.',
        }
        const validatedData = await request.validate({ schema: commentSchema, messages })
        const updComment = await comment.merge({postId: comment.postId, ...validatedData}).save()

        return response.status(200).json(updComment)
      }

      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      return response.status(400).json(error.messages.errors[0])
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    try {
      const comment = await Comment.findBy('slug', params['comment(slug)'])

      if (comment) {
        await comment.delete()

        return response.status(204)
      }

      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {

    }
  }
}
