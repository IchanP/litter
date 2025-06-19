/**
 * Credit to Mathias Loock for the idea and general structure of this file.
 */

import mongoose, { Schema } from 'mongoose'

const conversionOptions = {
  virtuals: true,

  /**
   * Executed when toJson or toObject is called on the document.
   *
   * @param {mongoose.Document} doc - The document which is being converted.
   * @param {mongoose.Document} ret - The plain object representation which has been converted.
   */
  transform: (doc, ret) => {
    delete ret._id
    delete ret.id
    delete ret.updatedAt
    delete ret.__v
  }
}

const baseSchema = new Schema({}, {
  toJSON: conversionOptions,
  toObject: conversionOptions,
  timestamps: true,
  optimisticConcurrency: true
}
)

export const BASE_SCHEMA = Object.freeze(baseSchema)
