const { createContainer, asValue } = require('awilix');
const { ObjectId } = require('mongodb');

const initDI = ({ logger, serverSettings, database }) => mediator => {
    mediator.once('app.init', () => {
        mediator.on('db.ready', (db) => {
            logger.info('Connected to MongoDB @@@@');
            const container = createContainer();

            container.register({
                logger: asValue(logger),
                db: asValue(db),
                serverSettings: asValue(serverSettings),
                ObjectId: asValue(ObjectId)
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
