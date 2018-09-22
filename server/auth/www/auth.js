import RestifyErrs from 'restify-errors';
import JWT from 'jsonwebtoken';

import AuthController from '../controllers/auth';
import UserController from '../controllers/users';

import routes from './routes';
import config from '../config';


const setup = (server) => {
    server.post(routes.getToken, async (req, res, next) => {
        const payload = req.body;
        if (!payload || !payload.email || !payload.password) {
            return next(new RestifyErrs.BadRequestError('Missing required fields!'));
        }

        try {
            const user = await UserController.getUser(payload.email);
            if (user.validatePassword(payload.password)) {
                const token = AuthController.getToken(user.getMetadata(), config.secret);
                res.send(200, {
                    success: true,
                    type: 'jwt',
                    token
                });
                return next();
            } else {
                return next(new RestifyErrs.UnauthorizedError('User not found!'));
            }
        } catch (error) {
            return next(new RestifyErrs.NotFoundError(error));
        }
    });

    server.get(routes.authMe, async (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader && !req.query._token) {
            return next(new RestifyErrs.UnauthorizedError('Missing authentication data!'));
        }

        try {
            const token = authHeader
                ? authHeader.split(' ').pop()
                : req.query._token;

            const me = AuthController.getMe(token, config.secret);
            const user = await UserController.getUser(me.email);
            user.passwordHash = undefined;

            res.send(200, user);
            return next();
        } catch (error) {
            if (error instanceof JWT.TokenExpiredError) {
                return next(new RestifyErrs.ForbiddenError('Token expired!'))
            }
            return next(new RestifyErrs.UnauthorizedError('Authentication failed!'));
        }
    });
}

export default {
    setup
};
