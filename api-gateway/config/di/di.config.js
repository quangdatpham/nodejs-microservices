const { createContainer, asValue } = require('awilix');

const initDI = ({ logger, serverSettings, docker }) => mediator => {
    mediator.once('app.init', () => {
        const container = createContainer();

        container.register({
            logger: asValue(logger),
            serverSettings: asValue(serverSettings),
            docker: asValue(docker)
        });

        mediator.emit('di.ready', container);
    })
}

module.exports = { initDI };
