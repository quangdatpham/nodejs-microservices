const spdy = require('spdy');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('../config/logger/');

const addRootRoute = require('../app/route/');

let morganFormat = ':method :url :status :res[content-length] - :response-time ms';

const start = options => {
    return new Promise((resolve, reject) => {
        if (!options.port)
            reject(new Error('port is require'));

        if (!options.repo)
            reject(new Error('repository is require'));

        const app = express();

        if (process.env.NODE_ENV === 'production')
            morganFormat = 'combined';

        app.use(helmet());
        app.use(morgan(morganFormat, { stream: logger.stream}));

        addRootRoute(app, options.repo);

        // if (process.env.NODE === 'test') {
            const server = app.listen(options.port, () => resolve(server))
        // } else {
        //     const server = spdy.createServer(options.ssl, app)
        //         .listen(options.port, () => resolve(server));
        // }
    })
}

module.exports = Object.create({ start })