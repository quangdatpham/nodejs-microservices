const { EventEmitter } = require('events');
const { db } = require('../config/');
const should = require('should');
const repository = require('../app/repository/');

describe('Initialize repository', function () {
    this.timeout(5000);

    it('should be a promise', done => {
        const mediator = new EventEmitter();

        mediator.on('db.ready', db => {
            repository.initialize(db).should.be.a.Promise();
            done();
        });

        db.connect(mediator);

        mediator.emit('boot.ready');
    });
});