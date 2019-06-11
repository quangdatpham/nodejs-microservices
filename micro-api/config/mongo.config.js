'use strict';

const { MongoClient } = require('mongodb');

const getMongoURL = (options) =>
    options.servers
        .reduce((prev, cur) => prev + cur + ',', 'mongodb://')
        .slice(0, - 1);

const connect = 
    options => 
        mediator => {
            mediator.once('boot.ready', () => {
                MongoClient.connect(
                    getMongoURL(options),
                    { useNewUrlParser: true }, 
                    (err, client) => {
                        if (err) 
                            return mediator.emit('db.error', err);
                        
                        const db = client.db(options.dbName);
                        mediator.emit('db.ready', db);
                        mediator.on('db.close', () => client.close());
                    }
                )
            })
}

module.exports = Object.assign({}, {connect})
