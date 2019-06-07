'use strict';

const express = require('express');
const proxy = require('http-proxy-middleware');
const spdy = require('spdy');
const helmet = require('helmet');
const morgan = require('morgan');

let morganFormat = ':method :url :status :res[content-length] - :response-time ms';

const start = (container) => {
  return new Promise((resolve, reject) => {
    const { port, ssl } = container.resolve('serverSettings');
    const routes = container.resolve('routes');
    const logger = container.resolve('logger');

    if (!routes)
        reject(new Error('routes is require'));
    
    if (!port)
        reject(new Error('port is require'));

    const app = express();

    logger.info('<<<<<<<<<<<<<<<<< Starting server >>>>>>>>>>>>>>>>');

    if (process.env.NODE_ENV === 'production')
        morganFormat = 'combined';

    app.use(helmet());
    app.use(morgan(morganFormat, { stream: logger.stream}));

    for (let id of Reflect.ownKeys(routes)) {
      const {route, target} = routes[id];
      logger.info(`Mapping route {} ${route} to ${target}`);

      app.use(route, proxy({
        target,
        changeOrigin: true,
        logProvider: () => logger
      }))
    }

    if (process.env.NODE === 'test') {
      const server = app.listen(port, () => resolve(server));
    } else {
      const server = spdy.createServer(ssl, app)
        .listen(port, () => resolve(server));
    }
  })
}

module.exports = Object.create({ start })
