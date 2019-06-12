const bcrypt = require('bcrypt');
const { to } = require('await-to-js');
const jwt = require('jsonwebtoken');
const status = require('http-status');

module.exports = container => {
    const { Account } = container.resolve('repos');

    const signIn = async (req, res, next) => {
        const { username, password } = req.body;
    
        const [ err, account ] = await to(Account.findByUsername(username));
        if (err) return next(err);
        
        if (!account)
            return res.status(status.OK)
                .send({
                    success: false,
                    message: 'Login failed',
                    errors: {
                        account: 'Account doesn\'t exist!'
                    },
                    token: null
                });

        bcrypt.compare(password, account.hashKey, function (err, result) {
            if (!result)
                return res.status(status.OK)
                    .send({
                        success: false,
                        message: 'Login failed',
                        errors: {
                            password: 'password incorrect'
                        },
                        token: null
                    });

            res.status(status.OK)
                .send({
                    success: true,
                    message: 'Login successfully',
                    error: null,
                    token: generateJWT(account)
                });
        });
    }

    const signUp = async (req, res, next) => {
        const { username, password, email, firstname, lastname } = req.body;
        let [ err, account ] = await to(Account.findByUsername(username));
        if (err) next(err);

        if (account)
            return res.send({
                success: false,
                message: 'Username has already been taken!',
                token: null
            });

        [ err, account ] = await to(Account.create({
            username, password, email, firstname , lastname
        }));
        if (err) return next(err);

        // sendEmail({
        //     to: account.email,
        //     subject: 'Register Verify',
        //     content: account.emailVerifyKey
        // });
        
        res.status(200).send({
            success: true,
            message: "Registered",
            token: generateJWT(account)
        });
    }

    const getVerifyEmail = async (req, res, next) => {
        const [ err, account ] = await to(Account.newEmailVerifyKey({ id: req.user._id }));
        if (err) return next(err);

        // sendEmail({
        //     to: account.email,
        //     subject: 'Verify',
        //     content: account.emailVerifyKey
        // });

        res.status(200).send({
            success: true,
            message: 'Email verification has been sent'
        });
    }

    const patchVerifyEmail = async (req, res, next) => {
        const { key } = req.body;

        const [ err, result ] = await to(Account.verifyEmail({ id: req.user._id, key }));
        if (err) return next(err);

        // sendEmail({
        //     to: account.email,
        //     subject: 'Verify Done',
        //     content: 'Verified'
        // });
        
        res.status(200).send(result);
    }

    const getResetPassword = async (req, res) => {
        const { username } = req.params;

        const [ err, account ] = await to(Account.newEmailVerifyKey({ username }));
        if (err) return next(err);

        // sendEmail({
        //     to: account.email,
        //     subject: "ResetPassword",
        //     content: account.emailVerifyKey
        // });

        res.status(200).send({
            success: true,
            message: "Email reset password"
        });
    }

    const patchVerifyPassword = async (req, res, next) => {
        const { username } = req.params;
        const { key } = req.body;

        const [ err, result ] = await to(Account.verifyPassword({ username, key }));
        if (err) return next(err);

        // sendEmail({
        //     to: account.email,
        //     subject: 'Verify Done',
        //     content: 'Verified'
        // });
        
        res.status(200).send(result);
    }

    const patchResetPassword = async (req, res, next) => {
        const { username } = req.params;
        const { password, confirmPassword } = req.body;

        const [ err, account ] = await to(Account.findByUsername(username));
        if (err) return next(err);

        if (!account)
            return res.status(200).send({
                success: false,
                message: "Account non-exist"
            });

        if (!account.resetPassword)
            return res.status(200).send({
                success: false,
                message: "Password unable to reset"
            });
        
        if (password != confirmPassword) 
            return res.status(200).send({
                success: false,
                message: "Password not match"
            });
        
        // sendEmail({
        //     to: account.email,
        //     subject: 'ResetPassword Done',
        //     content: 'Your password has resetted.'
        // });
        
        Account.updatePasswordById({ id: account._id.toString(), password });

        res.status(200).send({
            success: true,
            message: "Reset password"
        });
    }

    const checkingVerifyEmail = async (req, res, next) => {
        const [ err, isVerified ] = await to(Account.isVerified(req.user._id));
        if (err) return next(err);

        if (isVerified) {
            return res.status(200).send({
                success: false,
                message: 'This account was verified.'
            });
        }
    }

    /**private */
    const generateJWT = ({ _id, username }) => {
        const payloadToken = { _id, username };

        return jwt.sign(payloadToken, process.env.JWT_SECRET, {
            expiresIn: parseInt(process.env.JWT_EXPIRES)
        });
    };

    return {
        signIn,
        signUp,
        getVerifyEmail,
        patchVerifyEmail,
        getResetPassword,
        patchVerifyPassword,
        patchResetPassword,
        checkingVerifyEmail
    }
}
