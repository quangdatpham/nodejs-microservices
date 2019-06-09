const status = require('http-status');
const logger = require('../../config/logger/');
module.exports = container => {
    const { Account } = container.resolve('repos');
    
    const getAllAccounts = async (req, res) => {
        const accounts = await Account.getAllAccounts();
        
        res.status(status.OK)
            .render('templates/accounts/index', {
                title: 'List accounts',
                accounts
            });
    }

    const getAccountById = async (req, res) => {
        const { id } = req.params;
        const account = await Account.getAccountById(id);
        
        res.status(status.OK)
            .render('templates/accounts/show', {
                title: 'Account Details',
                account
            });
    }

    const newAccount = async (req, res) => {
        res.render('templates/accounts/new', {
            title: 'New account'
        });
    }

    const createAccount = async (req, res) => {
        const { username, password } = req.body;

        await Account.createAccount({
            username, password
        });

        res.redirect('/admin/accounts/');
    }

    return Object.create({
        getAllAccounts,
        getAccountById,
        newAccount,
        createAccount
    });
}
