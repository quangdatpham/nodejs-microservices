/* eslint-env mocha */
require('should');
const { EventEmitter } = require('events');
const repository = require('../app/repository/');
const dbSettings = require('../config/db.config');
const { createContainer, asValue } = require('awilix');

const container = createContainer();

const database = {
    connect: require('../config/mongo.config').connect(dbSettings)
}

describe('Initialize repository', function () {
    it('should be a promise', done => {
        const mediator = new EventEmitter();

        mediator.on('db.ready', db => {
            container.register({ db: asValue(db) });
            repository.initialize(container).should.be.a.Promise();
            done();
        });

        database.connect(mediator);

        mediator.emit('boot.ready');
    });
});