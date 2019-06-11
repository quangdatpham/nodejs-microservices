const express = require('express');
const router = express.Router();

module.exports = container => {
    const controller = require('../controllers/auth.controller')(container);

    router.post('/login', controller.postLogin);

    return router;
}