import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'

import Cache from '@ioc:Adonis/Addons/Cache'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { IQueryParams } from 'App/Interfaces/QeryParams'
import { OrderBy } from 'App/Enums/Sorted'
import Post from 'App/Models/Post'
import Topic from 'App/Models/Topic'

export default class TopicsController {
  public async index({ response, request }: HttpContextContract) {
    try {
      const { sort, order, page, size } = request.qs() as IQueryParams

      if (sort && order || page && size) {
        const topics =  await Topic.query()
          .if(sort && order, query => query.orderBy(sort, OrderBy[order]))
          .paginate(page, size)

        topics.baseUrl('/api/v1/topics')
        topics.queryString({ size, sort, order })
        topics.toJSON()

        return response.status(200).header('content-type', 'application/json').json(topics)
      }

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
      // console.log(await Cache.get(`topic_id_${params['topic(slug)']}`));
      const topic = await Cache.remember(`topic_id_${params['topic(slug)']}`, 15, async () => {
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

  public async getPosts({ request, response, params }: HttpContextContract) {
    try {
      const topic = await Topic.findBy('slug', params['topic(slug)'])

      if (topic) {
        const { sort, order, page, size } = request.qs() as IQueryParams
        const posts = await Post
          .query()
          .where('topic_id', '=', topic.id)
          .if(sort && order, query => query.orderBy(sort, OrderBy[order]))
          .paginate(page, size)

        posts.baseUrl(`/api/v1/topics/${topic.slug}/posts`)
        posts.queryString({ size, sort, order })
        posts.toJSON()

        return response.status(200).json(posts)
      } else {
        return response.status(404).send('Not found!')
      }
    } catch (error) {
      console.log(error)

      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    try {
      const topic = await Topic.findBy('slug', params['topic(slug)'])

      if (topic) {
        const topicSchema = schema.create({
          name: schema.string([rules.trim(), rules.minLength(3), rules.maxLength(200), rules.escape()])
        })
        const messages: CustomMessages = {
          required: 'Поле {{ field }} является обязательным.',
          minLength: 'Минимальная длинна {{ field }} - {{ options.minLength }} символа.',
          maxLength: 'Максимальная длинна {{ field }} - {{ options.maxLength }} символа.',
        }
        const validatedData = await request.validate({ schema: topicSchema, messages })
        const updTopic = await topic.merge(validatedData).save()

        await Cache.put(`topic_id_${params['topic(slug)']}`, updTopic)

        return response.status(200).header('content-type', 'application/json').json(updTopic)
      } else {
        return response.status(404).json({ message: 'Не найдено!' })
      }
    } catch (error) {
      console.log(error)

      return response.status(400).json(error.messages.errors[0])
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    try {
      const topic = await Topic.findBy('slug', params['topic(slug)'])

      if (topic) {
        await topic.delete()
        await Cache.forget(`topic_id_${params['topic(slug)']}`)

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
