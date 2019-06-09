'use strict';

const express = require('express');
const router = express.Router();

const addUserRoute = require('./account.route');

module.exports = (app, repo) => {
    addUserRoute(router, repo);

    app.use('/admin', router);
}