'use strict';

const { MongoClient } = require('mongodb');

const MONGO_URL = 'mongodb://localhost:27017';

const connect = 
    options => 
        mediator => {
            mediator.once('boot.ready', () => {
                MongoClient.connect(
                    MONGO_URL,
                    { useNewUrlParser: true },
                    (err, client) => {
                        if (err) 
                            mediator.emit('db.error', err);
                        
                        const db = client.db(options.dbName);
                        mediator.emit('db.ready', db);
                        mediator.on('db.close', () => client.close());
                    }
                )
            })
}

module.exports = Object.assign({}, {connect})
