const { User } = require('../models');
const { creatToken } = require('../utils/creatToken');

const addNewUser = async (displayName, email, password, image) => {
    const user = await User.findOne({ where: { email } });
    console.log(user);
    if (user) {
        return { type: 409, message: 'User already registered' };
    } 
    
    const newUser = await User.create({ displayName, email, password, image });
    const requiredForToken = { id: newUser.id };
    const token = creatToken(requiredForToken);
    return { type: 201, message: { token } };
};

const getAllUsers = async () => {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    return users;
};

module.exports = {
    addNewUser,
    getAllUsers,
};