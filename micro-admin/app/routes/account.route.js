'use strict';

const express = require('express');
const router = express.Router();


module.exports = container => {
    const controller = require('../controllers/account.controller')(container);

    router.get('/', controller.getAll);

    router.get('/new', controller.newAccount);

    router.post('/', controller.create);

    router.get('/:id', controller.getById);

    return router;
}
