import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'

import Cache from '@ioc:Adonis/Addons/Cache'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Topic from 'App/Models/Topic'

export default class TopicsController {
  public async index({ response }: HttpContextContract) {
    try {
      // console.log(await Cache.has('topics'));
      const topics = await Cache.remember('topics', 10, async () => {
        console.log('Cache');
        return await Topic.query()
      })
      // console.log('----------');
      // console.log(await Cache.get('topics'));
      // console.log('----------');

      return response.status(200).header('content-type', 'application/json').json(topics)
    } catch (error) {
      console.log(error)

      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async create({}: HttpContextContract) {}

  public async store({ request, response, auth }: HttpContextContract) {
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
      const topic = await Topic.create({userId: auth.user?.id, ...validatedData})

      await Cache.put('topics', topic, 1)

      return response.status(201).header('content-type', 'application/json').json(topic)
    } catch (error) {
      console.log(error)

      return response.status(400).json(error.messages.errors[0])
    }
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      // console.log(await Cache.has(`topic_id_${params['topic(slug)']}`));
      const topic = await Cache.remember(`topic_id_${params['topic(slug)']}`, 10, async () => {
        console.log('Cache');
        return await Topic.findBy('slug', params['topic(slug)'])
      })

      if (topic) {
        // console.log('----------');
        // console.log(await Cache.get(`topic_id_${params['topic(slug)']}`));
        // console.log('----------');

        return response.status(200).header('content-type', 'application/json').json(topic)
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
