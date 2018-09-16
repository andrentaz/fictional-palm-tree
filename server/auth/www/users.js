import errors from 'restify-errors';

import View from './view';
import routes from './routes';


export default class Users extends View {

    static views = [
        { name: 'get_users', 'method': Users.getUser },
        { name: 'create_user', 'method': Users.createUser },
    ]

    static getUser(server) {
        server.get(routes.getUsers, (req, res, next) => {
            if (!req.params.id) {
                return next(new errors.BadRequestError());
            }

            try {
                const user = {
                    name: 'Andre Filliettaz',
                    cellphone: '+5519998591253',
                    birthday: new Date(),
                    createdAt: new Date(),
                }
                res.send(200, user);
                return next();
            } catch (error) {
                return next(new errors.NotFoundError(error));
            }
        });
    }

    static createUser(server) {
        server.post(routes.users, (req, res, next) => {
            const { body } = req;
            if (!req.body) {
                return next(new errors.BadRequestError());
            }

            try {
                res.send(201);
                return next();
            } catch(errors) {
                return next(new errors.BadRequest());
            }
        });
    }
};
