require('console.table');
const { EventEmitter } = require('events');
const assert = require('assert');
const dbSettings = require('../config/db.config');
const mongo = require('../config/mongo.config');

describe('Connect to MongoDB', () => {
    it('should trigger `db.ready` and pass `db` object through EventEmitter', done => {
        const mediator = new EventEmitter();

        mediator.on('db.ready', db => {
            db.admin().listDatabases((err, dbs) => {
                assert.equal(null, err);
                assert.ok(dbs.databases.length > 0);
                console.table(dbs.databases);
                mediator.emit('db.close');
                done();
            })
        });

        mongo.connect(dbSettings)(mediator);

        mediator.emit('boot.ready');
    })
})
