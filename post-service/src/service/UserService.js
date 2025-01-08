/**
 * Service for interacting with the User-Service API.
 */
export class UserService {
    /**
     * Fetch the IDs of users that the given user is following.
     * @param {string} userId - The user's unique ID.
     * @returns {Promise<Array<string>>} List of followed user IDs.
     */
    async getFollowedUserIds(userId) {
        try {
            const response = await Fetch(`http://user-service:5000/users/${userId}/following`);
            return response.data.following; // Assuming the user-service returns a `following` array
        } catch (error) {
            console.error('Error fetching followed user IDs:', error.message);
            throw new Error('Failed to fetch followed users from user-service');
        }
    }
}