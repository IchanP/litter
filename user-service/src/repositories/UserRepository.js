import { UserModel } from '../model/userSchema.js'

/**
 * Repository for interacting with the User collection in MongoDB.
 */
export class UserRepository {
  /**
   * Fetch a user by their unique ID.
   *
   * @param {string} userId - The user's unique ID.
   * @returns {Promise<object>} The user document.
   */
  async findUserById (userId) {
    return UserModel.findOne({ userId })
  }

  /**
   * Finds a user by their unique profile id.
   *
   * @param {number} profileId - The profileID to find the user by.'
   * @returns {Promise<object>} - The user document.
   */
  async findUserByProfileId (profileId) {
    return UserModel.findOne({ profileId })
  }

  /**
   * Finds and returns a users followed userIds.
   *
   * @param {string} id - The userId.
   * @returns {Array<string>} - Returns the IDs of the following users.
   */
  async getFollowings (id) {
    const user = await UserModel.findOne({ userId: id })
    return user.following
  }

  /**
   * Search for users by a query string.
   *
   * @param {string} query - The search query.
   * @returns {Promise<Array>} A list of users matching the query.
   */
  async searchUsers (query) {
    return UserModel.find({ username: new RegExp(query, 'i') })
  }

  /**
   * Registers a user by writing it to the userModel.
   *
   * @param {object} user - A user object containing the fields userId, email and username.
   * @returns {object} - Returns the new user.
   */
  async registerUser (user) {
    const newUser = new UserModel({
      userId: user.userId,
      profileId: user.profileId,
      username: user.username,
      name: user.name,
      picture: user.picture,
      email: user.email,
      followers: [],
      following: [],
      registeredAt: user.createdAt
    })
    await newUser.save()
    return newUser
  }

  /**
   * Creates a relationship of following between two users.
   *
   * @param {string} followerId - The user that followed.
   * @param {string} followedId - The followed user.
   * @returns {Array<Document>} - Returns the two users in a relationship.
   */
  async createFollowRelationship (followerId, followedId) {
    const [followerUser, followedUser] = await this.#findTwoUsers(followerId, followedId)

    await Promise.all([
      UserModel.findByIdAndUpdate(
        followerUser._id,
        { $push: { following: followedUser.userId } }
      ),
      UserModel.findByIdAndUpdate(
        followedUser._id,
        { $push: { followers: followerUser.userId } }
      )
    ])
    return [followerUser, followedUser]
  }

  /**
   * Removes a following relationship between two users.
   *
   * @param {string} followerId - The user that followed.
   * @param {string} followedId - The followed user.
   * @returns {Array<Document>} - Returns the two updated users.
   */
  async removeRelationship (followerId, followedId) {
    const [followerUser, followedUser] = await this.#findTwoUsers(followerId, followedId)
    await Promise.all([
      UserModel.findByIdAndUpdate(
        followerUser._id,
        { $pull: { following: followedUser._id } }
      ),
      UserModel.findByIdAndUpdate(
        followedUser._id,
        { $pull: { followers: followerUser._id } }
      )
    ])
    return [followerUser, followedUser]
  }

  /**
   * Finds and returns two users matching the passed Ids.
   *
   * @param {string} idOne - The first user to find.
   * @param {string} idTwo - The second user to find.
   * @returns {Array<Document>} - Returns two User documents.
   */
  async #findTwoUsers (idOne, idTwo) {
    const [userOne, userTwo] = await Promise.all([
      UserModel.findOne({ userId: idOne }),
      UserModel.findOne({ userId: idTwo })
    ])
    if (!userOne || !userTwo) {
      throw new Error('Cannot find one or both users.')
    }

    return [userOne, userTwo]
  }
}
