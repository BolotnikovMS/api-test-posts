import Comment from 'App/Models/Comment'
import Factory from '@ioc:Adonis/Lucid/Factory'
import Post from 'App/Models/Post'
import Topic from 'App/Models/Topic'

export const TopicFactory = Factory
  .define(Topic, ({ faker }) => {
    return {
      name: faker.word.words({count: 5})
    }
  })
  .build()

  export const PostFactory = Factory
    .define(Post, ({ faker }) => {
      return {
        userId: faker.number.int({min: 1, max: 3}),
        topicId: faker.number.int({min: 1, max: 5}),
        title: faker.word.words({count: 3}),
        body: faker.lorem.paragraph(3)
      }
    })
    .build()

  export const CommentFactory = Factory
    .define(Comment, ({ faker }) => {
      return {
        userId: faker.number.int({min: 1, max: 3}),
        postId: faker.number.int({min: 1, max: 15}),
        commentBody: faker.word.words({count: 8}),
      }
    })
    .build()
