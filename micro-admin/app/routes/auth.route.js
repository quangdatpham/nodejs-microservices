const express = require('express');
const router = express.Router();

module.exports = container => {
    const controller = require('../controllers/auth.controller')(container);

    router.get('/login', controller.indexLogin);

    router.post('/login', controller.postLogin);

    return router;
}