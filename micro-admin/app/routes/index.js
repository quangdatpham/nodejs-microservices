'use strict';

const express = require('express');
const router = express.Router();

const accountRoute = require('./account.route');
const authRoute = require('./auth.route');

module.exports = container => {

	router.use('/accounts', accountRoute(container));

    router.use('/auth', authRoute(container));

    return router;
}
