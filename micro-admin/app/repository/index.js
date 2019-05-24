const userRepository = require('./user.repository');

const disconnect = connection => () => connection.close();

module.exports = Object.create({
    initialize: connection => {
        return new Promise((resolve, reject) => {
            if (!connection) {
                reject(new Error('connection is required'))
            }

            Promise.all([ userRepository.initialize(connection) ])
                .then(repos => {
                    resolve({
                        repos,
                        disconnect: disconnect(connection)
                    });
                })
                .catch(err => {
                    throw new Error(`Error while initialize repository err: ${err}`);
                })
        })
    },
})