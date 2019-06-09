'use strict';

const express = require('express');
const router = express.Router();


module.exports = container => {
    const controller = require('../controllers/account.controller')(container);

    router.get('/', controller.getAllAccounts);

    router.get('/new', controller.newAccount);

    router.post('/', controller.createAccount);

    router.get('/:id', controller.getAccountById);

    return router;
}
