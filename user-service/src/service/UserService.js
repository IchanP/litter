/**
 * Service for handling user-related business logic.
 */
export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Fetch a user's profile by ID.
     * @param {string} userId - The user's unique ID.
     * @returns {Promise<Object>} The user's profile data.
     */
    async getUser(userId) {
        const user = await this.userRepository.findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    /**
     * Search for users by a query string.
     * @param {string} query - The search query.
     * @returns {Promise<Array>} List of matching users.
     */
    async searchUsers(query) {
        return this.userRepository.searchUsers(query);
    }
}