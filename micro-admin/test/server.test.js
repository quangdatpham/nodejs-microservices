/* eslint-env mocha */
const { EventEmitter } = require('events');
const server = require('../server/');
const { db, serverSettings } = require('../config/');
const http = require('http');
const repository = require('../app/repository/');

describe('Start server', () => {
    it('should be an instanceof http.Server', done => {
        const mediator = new EventEmitter();

        mediator.on('db.ready', db => {
            repository.initialize(db)
                .then(repo => {
                    return server.start({
                        port: serverSettings.port,
                        repo
                    })
                })
                .then(app => {
                    app.should.be.an.instanceof(http.Server);
                    app.close();
                    done();
                });
        })

        db.connect(mediator);
        mediator.emit('boot.ready');
    })

    it('should require a port', () => {
        server.start({
            repo: {}
        }).should.be.rejectedWith(/port/);
    })

    it('should require repository', () => {
        server.start({
            port: 3000
        }).should.be.rejectedWith(/repository/);
    })
});