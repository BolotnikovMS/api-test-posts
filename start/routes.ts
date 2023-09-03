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

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.get('/topics', 'TopicsController.index')
  Route.post('/topics', 'TopicsController.store')
  Route.get('/topics/:topic(slug)', 'TopicsController.show')
  Route.get('/topics/:topic(slug)/posts', 'TopicsController.getPosts')
  Route.patch('/topics/:topic(slug)', 'TopicsController.update')
  Route.delete('/topics/:topic(slug)', 'TopicsController.destroy')

  Route.get('/posts', 'PostsController.index')
  Route.post('/posts', 'PostsController.store')
}).prefix('/api/v1/')
