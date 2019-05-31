/* eslint-env mocha */
const { EventEmitter } = require('events');
const server = require('../server/');
const serverSettings = require('../config/server.config');
const http = require('http');
const repository = require('../app/repository/');
const { createContainer, asValue } = require('awilix');
const dbSettings = require('../config/db.config');

const database = {
    connect: require('../config/mongo.config').connect(dbSettings)
}

describe('Start server', () => {
    it('should be an instanceof http.Server', done => {
        const mediator = new EventEmitter();
        
        mediator.on('db.ready', db => {
            
            const container = createContainer();
            container.register({ 
                serverSettings: asValue(serverSettings),
                db: asValue(db)
            });

            repository.initialize(container)
                .then(repos => {
                    container.register({ repos: asValue({ repos }) });
                    return server.start(container);
                })
                .then(app => {
                    app.should.be.an.instanceof(http.Server);
                    app.close();
                    done();
                });
        })

        database.connect(mediator);

        mediator.emit('boot.ready');
    })

    it('should require a port', () => {
        const container = createContainer();
        container.register({
            repos: asValue({}),
            serverSettings: asValue({})
        });

        server.start(container)
            .should.be.rejectedWith(/port/);
    })

    it('should require repository', () => {
        const container = createContainer();
        container.register({
            serverSettings: asValue({ port: 3000 })
        });

        server.start(container)
            .should.be.rejectedWith(/repos/);
    })
});