import restify from 'restify';
import mongoose from 'mongoose';

import AuthViews from './www/auth';
import UsersViews from './www/users';

import config from './config';

mongoose.Promise = global.Promise;
mongoose.connect(config.mongo_uri, { useNewUrlParser: true });

const main = () => {
    const port = config.port;
    const server = restify.createServer({
        name: 'auth server',
    });

    server.pre((req, res, next) => {
        console.info(`${req.method} - ${req.url}`);
        return next();
    });
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.bodyParser());

    registerEndpoints(server);

    server.listen(port, () => {
        console.info(`server running on port ${port}`);
    });
}

const registerEndpoints = (server) => {
    server.get('/', (req, res, next) => {
        res.send(200, 'Hello from authentication service!');
        return next();
    });

    AuthViews.setup(server);
    UsersViews.setup(server);
}

main();
