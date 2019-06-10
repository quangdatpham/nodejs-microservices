'use strict';

const express = require('express');
const router = express.Router();


module.exports = container => {
    const controller = require('../controllers/account.controller')(container);

    router.get('/', controller.findAll);

    router.get('/new', controller.newAccount);

    router.post('/', controller.create);

    router.get('/:id', controller.findById);

    return router;
}
