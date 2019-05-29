/*eslint no-console: ["off"] */
'use strict';

const server = require('./server/');
const config = require('./config/');
const repository = require('./app/repository/');
const logger = require('./config/logger/');
const { EventEmitter } = require('events');

const mediator = new EventEmitter();

mediator.on('db.ready', db => {
    repository.initialize(db)
        .then(repo => {
            return server.start({
                port: config.serverSettings.port,
                ssl: config.serverSettings.ssl,
                repo
            });
        })
        .then(app => {
            logger.info(`SERVER IS NOW LISTENING ON PORT ${config.serverSettings.port}`);
            app.on('app.close', () => {
                mediator.emit('db.close');
            });
        });
});

config.db.connect(mediator);

mediator.on('db.error', (err) => {
    logger.error('DB error :{}', err);
})
  
mediator.emit('boot.ready')