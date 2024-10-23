const bcrypt = require('bcrypt');
const User = require("../models/user");

exports.CreateUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // // Kiểm tra email đã tồn tại
        // const existingUser = await User.findOne({ where: { email } });
        // if (existingUser) {
        //     return res.status(400).json({ error: 'Email already in use' });
        // }
        // // Mã hóa mật khẩu
        // const hashedPassword = await bcrypt.hash(password, 10);
        // // Tạo user mới
        const user = await User.create({ 
            name,
            email,
            password 
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.GetAllUser = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.GetUserById = async (req, res) => {
    const { id } = req.params.id;
    try {
        const user = await User.findByPk(id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.UpdateUserById = async (req, res) => {
    const { id } = req.params.id;
    try {
        const user = await User.findByPk(id);
        if (user) {
            await user.update(req.body);
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.DeleteUserById = async (req, res) => {
    const { id } = req.params.id;
    try {
        const user = await User.findByPk(id);
        if (user) {
            await user.destroy();
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

