'use strict';

const express = require('express');
const router = express.Router();


module.exports = (app, repo) => {
    const controller = require('../controller/account.controller')(repo);

    router.get('/', controller.getAllAccounts);
    router.get('/:id', controller.getAccountById);

    app.use('/accounts', router);
}