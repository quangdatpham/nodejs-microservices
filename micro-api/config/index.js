const dbSettings = require('./db.config');
const serverSettings = require('./server.config');
const logger = require('./logger/');
const di = require('./di/');

const database = {
    connect: require('./mongo.config').connect(dbSettings)
}

module.exports = Object.create({
    di: di.initialize({ logger, serverSettings, database })
})