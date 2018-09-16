import restify from 'restify';
import dotenv from 'dotenv';

import UsersView from './www/users';

const main = () => {
    const port = process.env.PORT || 5000
    const server = restify.createServer({
        name: 'auth server',
    });

    server.pre((req, res, next) => {
        console.info(`${req.method} - ${req.url}`);
        return next();
    });
    server.use(restify.plugins.bodyParser());

    registerEndpoints(server);

    server.listen(port, () => {
        console.info(`server running on port ${port}`);
    });
}

const registerEndpoints = (server) => {
    server.get('/', (req, res, next) => {
        res.send(200, 'Hello World!');
        return next();
    });

    UsersView.setup(server);
}

dotenv.config();
main();
