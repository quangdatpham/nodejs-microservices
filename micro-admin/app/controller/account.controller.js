const status = require('http-status');

module.exports = repo => {
    const { Account } = repo;

    const getAllAccounts = async (req, res) => {
        const accounts = await Account.getAllAccounts();
        
        res.status(status.OK)
            .send(accounts);
    }

    const getAccountById = async (req, res) => {
        const { id } = req.params;
        const account = await Account.getAccountById(id);
        
        res.status(status.OK)
            .send(account);
    }

    return Object.create({
        getAllAccounts,
        getAccountById
    });
}