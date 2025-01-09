import { PostModel } from '../model/PostSchema.js'
import { Error } from 'mongoose'
import { TooMuchDataError } from '../util/Errors/TooMuchDataError.js'

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
      return post.toObject()
    } catch (e) {
      if (e instanceof Error.ValidationError) {
        throw new TooMuchDataError(e.message)
      }
    }
  }

  /**
   * Finds a Post from the postid.
   *
   * @param {number} postId - The matching postid to delete.
   * @returns {object | undefined} - Returns a Post matching the PostModel definition or undefined.
   */
  async getOneMatching (postId) {
    const numericPostId = this.#validateNumber(postId)
    const post = await PostModel.findOne({ postId: Number(numericPostId) })
    return post?.toObject()
  }

  /**
   * Deletes a post from the database.
   *
   * @param {number} postId - The id of the post to remove.
   */
  async deleteOneRecord (postId) {
    const numericPostId = this.#validateNumber(postId)
    const result = await PostModel.deleteOne({ postId: Number(numericPostId) })
    if (result.deletedCount === 0) {
      throw new Error(`No post found to delete with postId ${postId}`)
    }
  }

  /**
   * Validates that the number is a number and returns it as a number.
   *
   * @param {unknown} id - The value to validate
   * @returns {number} - Returns the number version
   */
  #validateNumber (id) {
    const numericPostId = Number(id)

    // Validate that it's a valid number
    if (isNaN(numericPostId)) {
      throw new Error('Invalid postId: must be a number')
    }
    return numericPostId
  }
}
