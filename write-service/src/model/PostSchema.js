import { model, Schema } from 'mongoose'
import { BASE_SCHEMA } from './BaseSchema.js'
import validator from 'validator'

const postSchema = new Schema({
  authorId: {
    type: String,
    required: true
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
  version: {
    type: Number,
    default: 0
  },
  events: [{
    type: String,
    payload: {
      oldValue: String,
      newValue: String
    },
    timestamp: Date
  }]
}, {})

postSchema.add(BASE_SCHEMA)
postSchema.index({ authorId: 1 })

export const postModel = model('Posts', postSchema)
