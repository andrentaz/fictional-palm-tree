import RestifyErrs from 'restify-errors';

import UserController from '../controllers/users';
import routes from './routes';


const setup = (server) => {
    server.post(routes.users, async (req, res, next) => {
        const payload = req.body;
        if (!payload || !payload.email || !payload.password) {
            return next(new RestifyErrs.BadRequestError());
        }

        try {
            const user = await UserController.getUser(payload.email);
            if (user.validatePassword(payload.password)) {
                user.passwordHash = undefined;
                res.send(200, user);
                return next();
            } else {
                return next(new RestifyErrs.UnauthorizedError('Wrong password!'));
            }
        } catch (error) {
            return next(new RestifyErrs.NotFoundError(error));
        }
    });

    server.post(routes.createUser, async (req, res, next) => {
        const payload = req.body;
        if (!payload || !payload.email || !payload.password || !payload.fullName || !payload.documentNumber) {
            return next(new RestifyErrs.BadRequestError('Missing required fields!'));
        }

        try {
            await UserController.createUser(payload);
            res.send(201);
            return next();
        } catch(error) {
            return next(new RestifyErrs.BadRequestError(error));
        }
    });
};

export default {
    setup
}
