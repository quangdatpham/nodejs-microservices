/*eslint no-console: ["off"] */
'use strict';

const server = require('./server/');
const { di } = require('./config/');
const repository = require('./app/repository/');
const { EventEmitter } = require('events');
const { asValue } = require('awilix');

const mediator = new EventEmitter();

mediator.on('di.ready', container => {
    const { logger } = container.cradle;
    
    repository.initialize(container)
        .then(repos => {
            logger.info('Initialized repository!');
            container.register({
                repos: asValue(repos)
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
});

di(mediator);

mediator.emit('app.init');