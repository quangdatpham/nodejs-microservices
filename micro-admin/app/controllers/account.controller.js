const status = require('http-status');
const { to } = require('await-to-js');

module.exports = container => {
    const { Account } = container.resolve('repos');
    
    const getAllAccounts = async (req, res, next) => {
        const [ err, accounts ] = await to(Account.getAllAccounts());
        if (err) return next(err);
        
        res.status(status.OK)
            .render('templates/accounts/index', {
                title: 'List accounts',
                accounts
            });
    }

    const getAccountById = async (req, res, next) => {
        const { id } = req.params;
        const [ err, account ] = await to(Account.getAccountById(id));
        if (err) return next(err);
        
        res.status(status.OK)
            .render('templates/accounts/show', {
                title: 'Account Details',
                account
            });
    }

    const newAccount = async (req, res, next) => {
        res.render('templates/accounts/new', {
            title: 'New account'
        });
    }

    const createAccount = async (req, res, next) => {
        const { username, password } = req.body;

        const [ err ] = await to(Account.createAccount({
            username, password
        }));

        if (err) return next(err);
        
        res.redirect('/admin/accounts/');
    }

    return Object.create({
        getAllAccounts,
        getAccountById,
        newAccount,
        createAccount
    });
}
