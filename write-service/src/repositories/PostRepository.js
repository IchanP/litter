import { PostModel } from '../model/PostSchema.js'
import { BadDataError } from '../util/Errors/BadDataError.js'
import { Error } from 'mongoose'

/**
 * Handles interactions with mongoose to write and find data pertaining to Posts.
 */
export class PostRepository {
  /**
   * Constructs a PostRepository object.
   */
  constructor () {
    this.model = PostModel
  }

  /**
   * Creates a document with the passed postData.
   *
   * @param {object} postData - PostData that has an authorId and content field.
   * @returns {object} - Returns an object with fields, authorId and content
   */
  async createDocument (postData) {
    try {
      const post = new PostModel({
        authorId: postData.authorId,
        content: postData.content
      })
      await post.save()
      return { authorId: post.authorId, content: post.content }
    } catch (e) {
      if (e instanceof Error.ValidationError) {
        throw new BadDataError(e.message)
      }
    }
  }
}
