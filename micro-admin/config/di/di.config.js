const { createContainer, asValue } = require('awilix');

const initDI = ({ logger, serverSettings, database }) => mediator => {
    mediator.once('app.init', () => {
        mediator.on('db.ready', (db) => {
            const container = createContainer();

            container.register({
                logger: asValue(logger),
                db: asValue(db),
                serverSettings: asValue(serverSettings),
                ObjectID: asValue(database.ObjectID)
            });

            mediator.emit('di.ready', container);
        })

        mediator.on('db.error', (err) => {
            mediator.emit('di.error', err);
        })

        database.connect(mediator);

        mediator.emit('boot.ready');
    })
}

module.exports = { initDI };
