'use strict';

const express = require('express');
const router = express.Router();

const accountRoute = require('./account.route');

module.exports = container => {

	router.use('/accounts', accountRoute(container));

    return router;
}
