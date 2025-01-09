/**
 * Service for handling post-related business logic.
 */
export class PostService {
    /**
     * Constructs a PostService object.
     *
     * @param {PostRepository} postRepository - The post repository responsible for fetching post data from mongodb.
     */
    constructor (postRepository, userService) {
        this.postRepository = postRepository // Handles database interactions for posts
    }

    /**
     * Fetch all posts by a specific user.
     *
     * @param {string} userId - The user's unique ID.
     * @returns {Promise<Array>} A list of posts by the user.
     */
    async getUserPosts (userId) {
        if (!userId) {
        throw new Error('User ID is required')
        }
        return this.postRepository.findPostsById(userId)
    }

    /**
     * Fetch the feed for a user based on followed users.
     *
     * @param {Array<string>} followedUserIds - List of user IDs the user follows.
     * @returns {Promise<Array>} A list of posts for the user's feed.
     */
    async getUserFeed(followedUserIds) {
        if (!Array.isArray(followedUserIds) || followedUserIds.length === 0) {
            return []; // Return an empty feed if there are no followed users
        }
        return this.postRepository.findFeedByIds(followedUserIds);
    }
}
