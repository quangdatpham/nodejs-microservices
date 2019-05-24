module.exports = Object.create({
    dbName: process.env.DB || 'dev_nodejs-microservices',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
})