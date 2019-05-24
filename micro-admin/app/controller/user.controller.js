const status = require('http-status');

module.exports = repo => {
    const { User } = repo.repositories;

    const getAllUsers = async (req, res) => {
        const users = await User.getAllUsers();
        
        res.status(status.OK)
            .send(users);
    }

    const getUserById = async (req, res) => {
        const { id } = req.params;
        const user = await User.getUserById(id);
        
        res.status(status.OK)
            .send(user);
    }

    return Object.create({
        getAllUsers,
        getUserById
    });
}