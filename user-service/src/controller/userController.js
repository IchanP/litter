import { BadDataError } from '../util/Errors/BadDataError.js';
import { DuplicateError } from '../util/Errors/DuplicateError.js';
import createError from 'http-errors';

/**
 * Controller for managing user-related operations.
 */
export class UserController {
    /**
     * Constructor for UserController.
     *
     * @param {UserService} userService - The service that handles user-related business logic.
     */
    constructor(userService) {
        this.userService = userService;
    }

    /**
     * Fetches a user's profile by their ID.
     *
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     * @param {Function} next - The next middleware function.
     */
    async getUserProfile(req, res, next) {
        try {
        const userId = req.params.id;
        const user = await this.userService.getUserProfile(userId);

        res.status(200).json({
            message: 'User profile retrieved successfully',
            data: user
        });
        } catch (e) {
        this.#handleError(e, next);
        }
    }

    /**
     * Searches for users by query.
     *
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     * @param {Function} next - The next middleware function.
     */
    async searchUsers(req, res, next) {
        try {
        const query = req.query.query;
        const users = await this.userService.searchUsers(query);

        res.status(200).json({
            message: 'Search results retrieved successfully',
            data: users
        });
        } catch (e) {
        this.#handleError(e, next);
        }
    }

    /**
     * Handles the error mapping for various error scenarios.
     *
     * @param {Error} e - The error that occurred.
     * @param {Function} next - The next middleware function.
     */
    #handleError(e, next) {
        let err = e;
        if (e instanceof BadDataError) {
        err = createError(400, e.message);
        } else if (e instanceof DuplicateError) {
        err = createError(409, e.message);
        } else {
        err = createError(500, 'An unexpected error occurred');
        }
        next(err);
    }
}