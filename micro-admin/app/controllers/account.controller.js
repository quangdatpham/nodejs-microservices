const status = require('http-status');
const { to } = require('await-to-js');

module.exports = container => {
    const { Account } = container.resolve('repos');
    
    const findAll = async (req, res, next) => {
        const [ err, accounts ] = await to(Account.findAll());
        if (err) return next(err);
        
        res.status(status.OK)
            .render('templates/accounts/index', {
                title: 'List accounts',
                accounts
            });
    }

    const findById = async (req, res, next) => {
        const { id } = req.params;
        const [ err, account ] = await to(Account.getById(id));
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

    const create = async (req, res, next) => {
        const { username, password } = req.body;

        const [ err ] = await to(Account.create({
            username, password
        }));

        if (err) return next(err);
        
        res.redirect('/admin/accounts/');
    }

    return Object.create({
        findAll,
        findById,
        newAccount,
        create
    });
}
