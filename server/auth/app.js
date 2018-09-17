import restify from 'restify';
import mongoose from 'mongoose';

import config from './config';
import UsersView from './www/users';


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

main();
