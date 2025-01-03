import { BadDataError } from './Errors/BadDataError.js'

/**
 * Validates that the passed variable is not undefined or null and throws an error if it is.
 *
 * @param {any} variable - May be any type
 * @param {string} eType - Variable or object name which cannot be undefined.
 */
export function validateNotUndefined (variable, eType) {
  if (variable === undefined || null) {
    throw new BadDataError(`${variable} is undefined or null.`)
  }
}
