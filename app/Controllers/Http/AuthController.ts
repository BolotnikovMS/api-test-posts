import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract) {
    try {
      const email = request.input('email')
      const password = request.input('password')
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '10 days',
      })

      return token.toJSON()
    } catch (error) {
      return response.status(403).json({ error })
    }
  }

  public async register({ request, response, auth }: HttpContextContract) {
    try {
      const email = request.input('email')
      const password = request.input('password')
      const surname = request.input('surname')
      const name = request.input('name')
      const patronymic = request.input('patronymic')
      const newUser = await User.create({surname, name, patronymic, email, password})

      await newUser.save()

      const token = await auth.use('api').login(newUser, {
        expiresIn: '10 day',
      })

      return token.toJSON()
    } catch (error) {
      return response.status(401).json({ error })
    }
  }
}
