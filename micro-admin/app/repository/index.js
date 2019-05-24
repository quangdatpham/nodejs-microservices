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
                    const repositories = repos.reduce((obj, repo) => {
                        const [k, v]  = Object.entries(repo)[0];
                        obj[k] = v;
                        return obj;
                    }, {});
                    
                    resolve({
                        repositories,
                        disconnect: disconnect(connection)
                    });
                })
                .catch(err => {
                    reject(new Error(`Error while initialize repository err: ${err}`));
                })
        })
    },
})