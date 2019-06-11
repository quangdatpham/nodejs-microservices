const express = require('express');
const router = express.Router();

module.exports = container => {
    const controller = require('../controllers/auth.controller')(container);
    const { authMiddleware: auth } = container.resolve('middlewares');

    router.post('/login', controller.signIn);

    router.post('/register', controller.signUp);

    router.get('/verify/email',
        auth.requireAuth,
        controller.getVerifyEmail
    );

    router.patch('/verify/email',
        auth.requireAuth,
        controller.patchVerifyEmail
    );

    router.get('/resetpwd/:username', controller.getResetPassword);

    router.patch('/verify/password', controller.patchVerifyPassword);

    router.patch('/resetpwd/:username', controller.patchResetPassword);

    return router;
}