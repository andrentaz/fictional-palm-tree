import errors from 'restify-errors';

import AuthController from '../controllers/auth';
import UserController from '../controllers/users';

import routes from './routes';
import config from '../config';


const setup = (server) => {
    server.post(routes.getToken, async (req, res, next) => {
        const payload = req.body;
        if (!payload || !payload.email || !payload.password) {
            return next(new errors.BadRequestError('Missing required fields!'));
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
                return next(new errors.UnauthorizedError('User not found!'));
            }
        } catch (error) {
            return next(new errors.NotFoundError(error));
        }
    });
}

export default {
    setup
};
