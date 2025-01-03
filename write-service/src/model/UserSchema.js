import { model, Schema } from 'mongoose'
import { BASE_SCHEMA } from './BaseSchema'
import validator from 'validator'

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    lowercase: true,
    maxLength: 254,
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
  }
})

userSchema.addb(BASE_SCHEMA)
