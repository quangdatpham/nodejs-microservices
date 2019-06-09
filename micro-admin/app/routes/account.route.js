'use strict';

const express = require('express');
const router = express.Router();


module.exports = (app, repos) => {
    const controller = require('../controllers/account.controller')(repos);

    router.get('/', controller.getAllAccounts);
    router.get('/:id', controller.getAccountById);

    app.use('/accounts', router);
}
