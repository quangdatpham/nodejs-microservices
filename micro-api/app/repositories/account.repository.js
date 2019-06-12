'use strict'

const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = container => {
    const ObjectId = container.resolve('ObjectId');
    const collection = container.resolve('db').collection('accounts');

    const findById = id => {
        return new Promise((resolve, reject) => {
            collection.findOne({ _id: ObjectId(id) }, (err, account) => {
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
                    reject(new Error(`Bcrypt err while creating account username: ${username}, err: ${err}`));
                const newAcc = {};

                newAcc.username = username;
                newAcc.hashKey = hash;
                newAcc.roles = [ 'user' ];

                newAcc.hashKey = hash;
                newAcc.emailVerifyKey = randomKey(6);
                newAcc.expirationEmailKey = generateExpirationDate();

                collection.insertOne(newAcc, (err) => {
                    if (err)
                        reject(new Error(`Error while creating account username: ${username}, err: ${err}`));
                    resolve(newAcc);
                });
            });
        });
    }

    const newEmailVerifyKey = ({ id, username }) => {
        return new Promise((resolve, reject) => {
            const emailVerifyKey = randomKey(6);
            const expirationEmailKey = generateExpirationDate();
            const queryOptions = {};

            if (id) queryOptions._id =  ObjectId(id);
            if (username) queryOptions.username =  username;

            collection.updateOne(queryOptions, { $set: { emailVerifyKey, expirationEmailKey } }, (err, account) => {
                if (err)
                    reject(new Error(`Error while set new email verify key ---- ${id || username}, err: ${err}`));
                
                resolve(account);
            });
        });
    }

    const isVerified = id => {
        return new Promise((resolve, reject) => {
            collection.findOne({ _id: ObjectId(id) }, (err, account) => {
                if (err)
                    reject(new Error(`Error while checking account verify email account.id: ${id}, err: ${err}`));

                resolve(account.isVerified);
            })
        })
    }

    const verifyEmail = ({id, key}) => {
        return new Promise((resolve, reject) => {
            collection.findOne( { _id: ObjectId(id) }, (err, account) => {
                if (err) 
                    return reject(new Error(`Error while verifying account.id: ${id}, err: ${err}`));
    
                if (account.emailVerifyKey != key)
                    return resolve({
                        success: false,
                        message: "Key invalid"
                    });
    
                if (
                    moment(account.expirationEmailKey)
                        .isBefore( (new Date()).toJSON() )
                ) {
                    return resolve({
                        success: false,
                        message: 'Key expired'
                    });
                }
                
                account.isVerified = true;

                collection.updateOne({ _id: ObjectId(id) }, { $set: account });
            
                resolve({
                    success: true,
                    message: "Verified"
                });
            })
        })
    }

    const verifyPassword = ({ username, key }) => {
        return new Promise((resolve, reject) => {
            collection.findOne( { username }, (err, account) => {
                if (err) 
                    reject(new Error(`Error while verifying password account.username: ${username}, err: ${err}`));
    
                if (account.emailVerifyKey != key)
                    resolve({
                        success: false,
                        message: "Key invalid"
                    });
    
                if (
                    moment(account.expirationEmailKey)
                        .isBefore( (new Date()).toJSON() )
                ) {
                    resolve({
                        success: false,
                        message: 'Key expired'
                    });
                }
                
                collection.updateOne({ username }, { $set: { resetPassword: true }});
            
                resolve({
                    success: true,
                    message: "Verified"
                });
            })
        })
    }

    const updatePasswordById = ({ id, password }) => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, function (err, hash) {
                if (err)
                    return reject(new Error(`Error while encrypting update password, account.id: ${id}, err: ${err}`));
    
                const updateFields = {
                    hashKey: hash,
                    resetPassword: false
                }
    
                collection.updateOne({ _id: ObjectId(id) }, { $set:  updateFields }, (err, result) => {
                    if (err)
                        return reject(new Error(`Error while updating password, account.id: ${id}, err: ${err}`));
                    
                    resolve(result);
                });
            });
        });
    }

    const findRolesById = id => {
        return new Promise((resolve, reject) => {
            collection.findOne({ _id: ObjectId(id) }, (err, account) => {
                if (err)
                    reject(new Error(`Error while geting account\'s roles id: ${id}, err: ${err}`));
                
                resolve(account.roles);
            });
        })
    };

    const findByUsername = username => {
        return new Promise((resolve, reject) => {
            collection.findOne({ username }, (err, account) => {
                if (err)
                    reject(new Error(`Can not find account by username: ${username}, err: ${err}`));

                resolve(account);
            });
        })
    }

    /**private */
    const generateExpirationDate = () => {
        const date = (new Date).toJSON();
        return moment(date).add(
            process.env.EMAILKEY_DURATION,
            'seconds'
        ).toJSON();
    }

    const randomKey = length =>Array.from({ length })
        .map(() => Math.floor(Math.random() * 10))
        .join('');

    return {
        findById,
        create,
        findRolesById,
        findByUsername,
        newEmailVerifyKey,
        isVerified,
        verifyEmail,
        verifyPassword,
        updatePasswordById
    }
}
