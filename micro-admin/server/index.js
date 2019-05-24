const express = require('express');
const helmet = require('helmet');

const start = options => {
    return new Promise((resolve, reject) => {
        const app = express();

        app.use(helmet());

        const server = app.listen(options.port, () => resolve(server));
    })
}

module.exports = Object.create({ start })