'use strict'

const bcrypt = require('bcrypt');

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

                account.hashKey = hash;
                account.emailVerifyKey = randomKey(6);

                setExpirationEmailKey(account);

                collection.insertOne(newAcc, (err) => {
                    if (err)
                        reject(new Error(`Error while creating account username: ${username}, err: ${err}`));
                    resolve();
                });
            });
        });
    }

    const newEmailVerifyKey = ({id, username}) => {
        return new Promise((resolve, reject) => {
            const emailVerifyKey = randomKey(6);
            const queryOptions = {};

            if (id) queryOptions._id =  ObjectId(id);
            if (id) queryOptions.username =  username;

            collection.updataOne(queryOptions, { emailVerifyKey }, (err, account) => {
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
                    reject(new Error(`Error while verifying account.id: ${id}, err: ${err}`));
    
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
                
                account.isVerified = true;
            
                resolve({
                    success: true,
                    message: "Verified"
                });
            })
        })
    }

    const verifyPassword = ({id, key}) => {
        return new Promise((resolve, reject) => {
            collection.findOne( { _id: ObjectId(id) }, (err, account) => {
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
                
                account.resetPassword = true;
            
                resolve({
                    success: true,
                    message: "Verified"
                });
            })
        })
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
    const setExpirationEmailKey = account => {
        const date = (new Date).toJSON();
        account.expirationEmailKey = moment(date).add(
            process.env.EMAILKEY_DURATION,
            'seconds'
        );
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
        verifyPassword
    }
}
