import User from '../models/User.js';

export const getUsers = async (req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
}; 

export const updateRole = async (req, res) => {
    const user = await User.findById(req.params.id);
    user.role = req.body.role || user.role;
    await user.save();
    res.json({ message: 'User role updated successfully' });
};