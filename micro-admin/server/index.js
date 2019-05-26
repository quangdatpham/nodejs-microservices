const spdy = require('spdy');
const express = require('express');
const helmet = require('helmet');

const addRootRoute = require('../app/route/');

const start = options => {
    return new Promise((resolve, reject) => {
        if (!options.port)
            reject(new Error('port is require'));

        if (!options.repo)
            reject(new Error('repository is require'));

        const app = express();

        app.use(helmet());
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