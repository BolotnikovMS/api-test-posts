import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator';

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Topic from 'App/Models/Topic'

export default class TopicsController {
  public async index({ response }: HttpContextContract) {
    try {
      const topics = await Topic.query()

      return response.status(200).json(topics)
    } catch (error) {
      console.log(error)

      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async create({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    try {
      const topicSchema = schema.create({
        name: schema.string([rules.trim(), rules.minLength(3), rules.maxLength(200), rules.escape()])
      })
      const messages: CustomMessages = {
        required: 'Поле {{ field }} является обязательным.',
        minLength: 'Минимальная длинна {{ field }} - {{ options.minLength }} символа.',
        maxLength: 'Максимальная длинна {{ field }} - {{ options.maxLength }} символа.',
      }
      const validatedData = await request.validate({ schema: topicSchema, messages })
      const topic = await Topic.create({userId: 1, ...validatedData})

      return response.status(201).json(topic)
    } catch (error) {
      console.log(error)

      return response.status(400).json({ error })
    }
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const topic = await Topic.findBy('slug', params['topic(slug)'])

      if (topic) {
        return response.status(200).send(topic)
      } else {
        return response.status(404).json({ message: 'Не найдено!' })
      }
    } catch (error) {
      console.log(error)

      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }

  }

  public async getPosts({ response, params }: HttpContextContract) {
    try {
      const topic = await Topic.findBy('slug', params['topic(slug)'])

      if (topic) {
        await topic.load('posts')

        return response.status(200).json(topic.posts)
      } else {
        return response.status(404).send('Not found!')
      }
    } catch (error) {
      console.log(error)

      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async edit({}: HttpContextContract) {}

  public async update({ request, response, params }: HttpContextContract) {
    try {
      const { name } =  request.only(['name'])

      if (!name) return response.status(400).json({ message: 'Некорректные данные!' })

      const topic = await Topic.findBy('slug', params['topic(slug)'])

      if (topic) {
        const updTopic = await topic.merge({name}).save()

        return response.status(200).json(updTopic)
      } else {
        return response.status(404).json({ message: 'Не найдено!' })
      }
    } catch (error) {
      console.log(error)

      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    try {
      const topic = await Topic.findBy('slug', params['topic(slug)'])

      if (topic) {
        await topic.delete()

        return response.status(204)
      } else {
        return response.status(404).json({ message: 'Не найдено!' })
      }
    } catch (error) {
      console.log(error)

      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }
}
