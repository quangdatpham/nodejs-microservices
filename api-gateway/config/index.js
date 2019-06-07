const serverSettings = require('./server.config');
const logger = require('./logger/');
const di = require('./di/');
const docker = require('./docker/');

module.exports = Object.create({
    di: di.initialize({ logger, serverSettings, docker })
})
