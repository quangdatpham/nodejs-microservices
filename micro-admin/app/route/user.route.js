'use strict';

const express = require('express');
const router = express.Router();


module.exports = (app, repo) => {
    const controller = require('../controller/user.controller')(repo);

    router.get('/', controller.getAllUsers);
    router.get('/:id', controller.getUserById);

    app.use('/users', router);
}