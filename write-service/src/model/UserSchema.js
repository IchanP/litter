import { model, Schema } from 'mongoose'
import { BASE_SCHEMA } from './BaseSchema.js'
import validator from 'validator'
import { Counter } from './Counter.js'

const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: { unique: true, background: true }
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    index: { unique: true, background: true },
    lowercase: true,
    maxLength: 254, // NOTE - should this be lower?
    trim: true,
    validate: {
      /**
       * Validates that the email matches an email string before writing.
       *
       * @param {string} v - The email to validate
       * @returns {boolean} - Returns true if regex passes, false otherwise.
       */
      validator: function (v) {
        return validator.isEmail(v)
      },
      /**
       * Returns an error message if email does not match.
       *
       * @param {object} props - The object containing the email value.
       * @returns {string} - An error message.
       */
      message: props => `${props.value} is not a valid email address!`
    }
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    index: { unique: true, background: true },
    lowercase: true,
    minLength: [3, 'The username must be a minimum length of 3 characters.'],
    maxLength: [40, 'The username must be a maximum length of 40 characters.'],
    trim: true
  },
  profileId: {
    type: Number,
    index: { unique: true, background: true }
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

userSchema.pre('save', async function (next) {
  if (this.isNew) { // Check if the document is new
    const count = await Counter.findByIdAndUpdate(
      { _id: 'profileId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    )
    this.profileId = count.seq
  }
  next()
})

userSchema.add(BASE_SCHEMA)

export const UserModel = model('User', userSchema)
