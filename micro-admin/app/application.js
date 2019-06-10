'use strict';

require('dotenv').config();

const { EventEmitter } = require('events');
const { asValue } = require('awilix');

const server = require('./server/server');
const { di } = require('../config/');
const repository = require('./repositories/');
const helpers = require('./helpers/');
const middlewares = require('./middlewares/');

const mediator = new EventEmitter();

mediator.on('di.ready', container => {
    const { logger } = container.cradle;
    
    logger.info('DI is ready!');

    Promise.all([
        repository.initialize(container),
        helpers.initialize(container),
        middlewares.initialize(container)
    ])
        .then(([ repos, helpers, middlewares ]) => {
            container.register({
                repos: asValue(repos),
                helpers: asValue(helpers),
                middlewares: asValue(middlewares)
            });

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

        mediator.on('di.error', err => {
            logger.error('DI ERROR :{}' + err.stack);
        });
});

di(mediator);

mediator.emit('app.init');
