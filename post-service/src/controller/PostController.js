/**
 * Controller for handling post-related API requests.
 */
export class PostController {
    constructor(postService) {
        this.postService = postService;
    }

    /**
     * Fetch all posts by a specific user.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     */
    async getUserPosts(req, res, next) {
        try {
            const userId = req.params.userId;
            const posts = await this.postService.getUserPosts(userId);
            res.status(200).json({
                success: true,
                data: posts
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Fetch the feed for a user based on followed users.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     */
    async getUserFeed(req, res, next) {
        try {
            const userId = req.params.userId; // ID för användaren som vill se sitt feed
            const feed = await this.postService.getUserFeed(userId);
            res.status(200).json({
                success: true,
                data: feed
            });
        } catch (error) {
            next(error);
        }
    }
}
