import { model, Schema } from 'mongoose'
import { BASE_SCHEMA } from './BaseSchema.js'
import validator from 'validator'
import { Counter } from './Counter.js'

const postSchema = new Schema({
  postId: {
    type: Number,
    index: { unique: true, background: true }
  },
  authorId: {
    type: String
  },
  content: {
    required: true,
    type: String,
    trim: true,
    maxLength: [42, 'The length of the post cannot excede 42'],
    validate: {
      /**
       * Validates that the content is okay, and prevents possible script attacks when it's later rendered in the frontend.
       *
       * @param {string} v - The value to validate.
       * @returns {boolean} - Returns true if content is okay. False otherwise.
       */
      validator: function (v) {
        return validator.escape(v) && // Escapes HTML chars
          !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(v) // No script tags
      },
      message: 'Invalid post content'
    }
  },
  // For if the post is edited.
  events: [{
    type: String,
    payload: {
      oldValue: String,
      newValue: String
    },
    timestamp: Date
  }]
}, {})

postSchema.pre('save', async function (next) {
  if (this.isNew) { // Check if the document is new
    const count = await Counter.findByIdAndUpdate(
      { _id: 'postId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    )
    this.postId = count.seq
  }
  next()
})

postSchema.add(BASE_SCHEMA)

export const PostModel = model('Posts', postSchema)
