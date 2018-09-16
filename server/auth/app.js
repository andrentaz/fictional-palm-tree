import restify from 'restify';

const server = restify.createServer({
    name: 'first server',
});

server.get('/', (req, res, next) => {
    res.send(200, 'Hello World!');
    return next();
});

server.listen(8000, () => {
    console.info('api running on port 8000');
});
