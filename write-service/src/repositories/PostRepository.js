import { PostModel } from '../model/PostSchema.js'

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
}
