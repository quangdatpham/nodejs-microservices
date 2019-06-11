const status = require('http-status');
const { to } = require('await-to-js');

module.exports = container => {
    const { Account } = container.resolve('repos');
    
    const showProfile = async (req, res, next) => {
        res.status(status.OK)
            .send({});
    }

    return Object.create({
        showProfile
    });
}
