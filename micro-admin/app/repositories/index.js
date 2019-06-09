const userRepository = require('./account.repository');

module.exports = Object.create({
    initialize: container => {
        const { db: connection } = container.cradle;

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
                    
                    resolve(repositories);
                })
                .catch(err => {
                    reject(new Error(`Error while initialize repository err: ${err}`));
                })
        })
    },
})