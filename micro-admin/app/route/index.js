'use strict';

const express = require('express');
const router = express.Router();

const addUserRoute = require('./user.route');

module.exports = (app, repo) => {
    addUserRoute(router, repo);

    app.use('/admin', router);
}