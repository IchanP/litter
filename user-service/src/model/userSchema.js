import { Schema, model } from 'mongoose'

/**
 * Defines the MongoDB schema for a User document.
 */
const userSchema = new Schema({
  /**
   * Unique identifier for the user.
   */
  userId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    required: true
  },
  profileId: {
    type: Number,
    required: true,
    unique: true
  },
  /**
   * The user's username.
   */
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  /**
   * The user's email address.
   */
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  /**
   * List of followers (references other users).
   */
  followers: [
    {
      type: String
    }
  ],
  /**
   * List of users this user is following.
   */
  following: [
    {
      type: String
    }
  ],
  registeredAt: {
    type: String,
    required: true
  }
}, {
  // Ensure unique entries for followers/following
  indexes: [
    {
      fields: {
        _id: 1,
        followers: 1
      },
      unique: true,
      sparse: true
    },
    {
      fields: {
        _id: 1,
        following: 1
      },
      unique: true,
      sparse: true
    }
  ]
})

export const UserModel = model('User', userSchema)
