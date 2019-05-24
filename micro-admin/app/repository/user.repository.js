'use strict'

const repository = (db) => {
  const collection = db.collection('users');

  const getAllUsers = () => {
      return new Promise((resolve, reject) => {
          const users = [];
          const cursor = collection.find({});
          cursor.forEach(user => users.push(user));
          resolve(users.slice());
      })
  }

  const getUserById = id => {
      return new Promise((resolve, reject) => {
          collection.findOne({ id }, (err, user) => {
                if (err)
                    reject(new Error(`Error while fetching user by id: ${id}, err: ${err}`));

                resolve(user);
          });
      })
  }

  return {
      User: {
          getAllUsers,
          getUserById
      }
  }
}

module.exports = Object.create({
    initialize: connection => {
        return new Promise((resolve, reject) => {
            resolve(repository(connection))
        })
    }
})
