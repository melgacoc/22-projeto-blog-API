const UserService = require('../services/userService');

const addNewUser = async (req, res) => {
    const { displayName, email, password, image } = req.body;
    const { type, message } = await UserService.addNewUser(
        displayName, email, password, image || null,
    );
    
    if (type === 409) return res.status(type).json({ message });
    return res.status(201).json(message);
};

const getAllUsers = async (_req, res) => {
    const users = await UserService.getAllUsers();
    return res.status(200).json(users);
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await UserService.getUserById(id);
    if (user === null) {
        return res.status(404).json({ message: 'User does not exist' });
    }
    return res.status(200).json(user);
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    await UserService.getUserById(id);
    return res.status(204).end();
};

module.exports = {
    addNewUser,
    getAllUsers,
    getUserById,
    deleteUser,
};