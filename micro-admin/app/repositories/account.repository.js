'use strict'

const bcrypt = require('bcrypt');

module.exports = (db) => {
    const collection = db.collection('accounts');

    const findAll = () => {
        return new Promise((resolve, reject) => {
            const accounts = [];
            const cursor = collection.find({});
            cursor.forEach(account => accounts.push(account));
            resolve(accounts.slice());
        })
    }

    const findById = id => {
        return new Promise((resolve, reject) => {
            collection.findOne({ id }, (err, account) => {
                if (err)
                    reject(new Error(`Error while fetching account by id: ${id}, err: ${err}`));

                resolve(account);
            });
        })
    }

    const create = ({ username, password }) => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, function (err, hash) {
                if (err)
                    reject(new Error(`Bcrypt err while creating account username: ${username}`));
                const newAcc = {};

                newAcc.username = username;
                newAcc.hashKey = hash;
                newAcc.roles = [ 'user' ];

                collection.insertOne(newAcc, (err) => {
                    if (err)
                        reject(new Error(`Error while creating account username: ${username}`));
                    resolve();
                });
            });
        });
    }

    const findRolesByUserId = id => {
        return new Promise((resolve, reject) => {
            collection.findOne({ id }, { roles: 1 }, (err, account) => {
                if (err)
                    reject(new Error(`Error while geting account\'s roles id: ${id}`));
                
                resolve(account.roles);
            });
        })
    };

    const findByUsername = username => {
        return new Promise((resolve, reject) => {
            collection.findOne({ username }, (err, account) => {
                if (err)
                    reject(new Error(`Can not find account by username: ${username}`));

                resolve(account);
            });
        })
    }
    
    return {
        findAll,
        findById,
        create,
        findRolesByUserId,
        findByUsername
    }
}
