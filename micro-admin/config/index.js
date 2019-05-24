const dbSettings = require('./db.config');
const serverSettings = require('./server.config')

module.exports = Object.create({
    dbSettings,
    serverSettings,
    db: {
        connect: require('./mongo.config').connect(dbSettings)
    }
})