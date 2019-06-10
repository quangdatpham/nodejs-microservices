const bcrypt = require('bcrypt');
const { to } = require('await-to-js');

module.exports = container => {
    const { Account } = container.resolve('repos');

    const indexLogin = async (req, res) => {
        res.render('templates/auth/login', { title: 'Login' });
    }

    const postLogin = async (req, res, next) => {
        const { username, password } = req.body;
    
        const [ err, account ] = await to(Account.findByUsername(username));
        if (err) return next(err);
    
        if (!account)
            return res.render('templates/auth/login', { error: 'Account doesn\'t exist!'});

        bcrypt.compare(password, account.hashKey, function (err, result) {
            if (!result)
                return res.render('templates/auth/login', { error: 'password incorrect' });

            res.cookies('token', generateJWT(account));

            res.redirect('/admin/');
        });
    }

    const generateJWT = function () {
        const { id, username } = this;
    
        const payloadToken = { id, username };
    
        return jwt.sign(payloadToken, process.env.JWT_SECRET, {
            expiresIn: parseInt(process.env.JWT_EXPIRES)
        });
    };

    return {
        indexLogin,
        postLogin
    }
}
