'use strict';

require('dotenv').config();

const server = require('./server/server');
const { di } = require('../config/');
const { EventEmitter } = require('events');
const { asValue } = require('awilix');
const middlewares = require('./middlewares/');

const mediator = new EventEmitter();

mediator.on('di.ready', container => {
    const { logger } = container.cradle;
    const docker = container.resolve('docker');

    
    logger.info('DI is ready!');

    docker.discoverRoutes(container)
        .then(routes => {
            container.register({ routes: asValue(routes) });
            return middlewares.initialize(container);
        })
        .then(middlewares => {
            container.register({ middlewares: asValue(middlewares) });
            return server.start(container);
        })
        .then(app => {
            logger.info(`SERVER IS NOW LISTENING ON PORT ${app.address().port}`);
            app.on('app.close', () => {
                mediator.emit('db.close');
            });
        })
        .catch(err => {
            logger.error(err.message);
            logger.error(err.stack);
        });
});

di(mediator);

mediator.emit('app.init');
