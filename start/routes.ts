/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import { CommentFactory, PostFactory, TopicFactory } from 'Database/factories'

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.group(() => {
    Route.get('/topics', async () => {
      await TopicFactory.createMany(5)
    })
    Route.get('/posts', async () => {
      await PostFactory.createMany(4)
    })
    Route.get('/comments', async () => {
      await CommentFactory.createMany(10)
    })
  }).prefix('/faker')

  Route.post('/register', 'AuthController.register')
  Route.post('/login', 'AuthController.login')
  Route.group(() => {
    Route.get('/', 'TopicsController.index')
    Route.post('/', 'TopicsController.store')
    Route.get('/:topic(slug)', 'TopicsController.show')
    Route.get('/:topic(slug)/posts', 'TopicsController.getPosts')
    Route.patch('/:topic(slug)', 'TopicsController.update')
    Route.delete('/:topic(slug)', 'TopicsController.destroy')
  }).prefix('/topics').middleware('auth:api')

  Route.group(() => {
    Route.get('/', 'PostsController.index')
    Route.post('/', 'PostsController.store')
    Route.get('/:post(slug)', 'PostsController.show')
    Route.get('/:post(slug)/comments', 'PostsController.getComments')
    Route.patch('/:post(slug)', 'PostsController.update')
    Route.delete('/:post(slug)', 'PostsController.destroy')
  }).prefix('/posts').middleware('auth:api')

  Route.group(() => {
    Route.get('/', 'CommentsController.index')
    Route.post('/', 'CommentsController.store')
    Route.patch('/:comments(slug)', 'CommentsController.update')
    Route.delete('/:comments(slug)', 'CommentsController.destroy')
  }).prefix('/comments').middleware('auth:api')
}).prefix('/api/v1/')
