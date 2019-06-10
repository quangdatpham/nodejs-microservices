'use strict'

module.exports = (db) => {
    const collection = db.collection('accounts');

    const getAllAccounts = () => {
        return new Promise((resolve, reject) => {
            const accounts = [];
            const cursor = collection.find({});
            cursor.forEach(account => accounts.push(account));
            resolve(accounts.slice());
        })
    }

    const getAccountById = id => {
        return new Promise((resolve, reject) => {
            collection.findOne({ id }, (err, account) => {
                if (err)
                    reject(new Error(`Error while fetching account by id: ${id}, err: ${err}`));

                resolve(account);
            });
        })
    }

    const createAccount = (account) => {
        return new Promise((resolve, reject) => {
            collection.insertOne(account, (err, account) => {
                if (err)
                    reject(new Error(`Error while creating account username: ${account.username}, password: ${account.password}`))
                resolve(account);
            });
        });
    }

    const getRolesByUserId = function (id) {
        return new Promise((resolve, reject) => {
            collection.findOne({ id }, { roles: 1 }, (err, account) => {
                if (err)
                    reject(new Error(`Error while geting account\'s roles id: ${id}`));
                
                resolve(account.roles);
            });
        })
    };
    
    return {
        getAllAccounts,
        getAccountById,
        createAccount,
        getRolesByUserId
    }
}
