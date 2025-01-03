import { model, Schema } from 'mongoose'
import { BASE_SCHEMA } from './BaseSchema.js'

const followSchema = new Schema({
  followerId: {
    type: String,
    required: true
  },
  followedId: {
    type: String,
    required: true
  }
}, {})

followSchema.add(BASE_SCHEMA)

// Should prevent multiple follow relationships, by enforcing uniqueness on the two fields
followSchema.index({ followerId: 1, followedId: 1 }, { unique: true })

export const FollowModel = model('Follows', followSchema)
