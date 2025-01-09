import { Schema, model } from 'mongoose'

/**
 * Defines the MongoDB schema for a Post document.
 */
const postSchema = new Schema({
  /**
   * Unique identifier for the post.
   */
  postId: {
    type: String,
    required: true,
    unique: true
  },
  /**
   * The ID of the user who created the post.
   */
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Referens till User-modellen
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
  /**
   * Date and time when the post was created.
   */
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const PostModel = model('Post', postSchema)
