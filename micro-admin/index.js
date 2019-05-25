/*eslint no-console: ["off"] */
'use strict';

const server = require('./server/');
const config = require('./config/');
const repository = require('./app/repository/');
const { EventEmitter } = require('events');

const mediator = new EventEmitter();

mediator.on('db.ready', db => {
    repository.initialize(db)
        .then(repo => {
            return server.start({
                port: config.serverSettings.port,
                repo
            });
        })
        .then(app => {
            console.log(`Server is now running on port ${config.serverSettings.port}`);
            app.on('app.close', () => {
                mediator.emit('db.close');
            });
        });
});

config.db.connect(mediator);

mediator.on('db.error', (err) => {
    console.error(err)
})
  
mediator.emit('boot.ready')