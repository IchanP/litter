import { Schema, model } from 'mongoose'

/**
 * Defines the MongoDB schema for a Post document.
 */
const postSchema = new Schema({
  /**
   * The ID of the user who created the post.
   */
  userId: {
    type: String,
    required: true
  },
  /**
   * The content of the post.
   */
  content: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  /**
   * Date and time when the post was created.
   */
  createdAt: {
    type: Date,
    default: Date.now
  },
  postId: {
    type: Number,
    index: { unique: true, background: true },
    required: true
  }
})

export const PostModel = model('Post', postSchema)
