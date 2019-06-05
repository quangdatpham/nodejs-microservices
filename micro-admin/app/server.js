const spdy = require('spdy');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('../config/logger');

const addRootRoute = require('./route');

let morganFormat = ':method :url :status :res[content-length] - :response-time ms';

const start = container => {
    return new Promise((resolve, reject) => {
        const { port, ssl } = container.resolve('serverSettings');
        const repos = container.resolve('repos');

        if (!port)
            reject(new Error('port is require'));

        if (!repos)
            reject(new Error('repository is require'));

        const app = express();

        if (process.env.NODE_ENV === 'production')
            morganFormat = 'combined';

        app.use(helmet());
        app.use(morgan(morganFormat, { stream: logger.stream}));

        addRootRoute(app, repos);

        app.use((err, req, res, next) => {
            reject(new Error('Something went wrong! :{}' + err));
            res.status(500).send({
                url: req.url,
                message: err.message,
                stack: err.stack
            });
        })

        app.use((req, res, next) => {
            logger.warn(`WARN url not found :[] ${req.url}`);
            next();
        });

        if (process.env.NODE === 'test') {
            const server = app.listen(port, () => resolve(server))
        } else {
            const server = spdy.createServer(ssl, app)
                .listen(port, () => resolve(server));
        }
    })
}

module.exports = Object.create({ start })
