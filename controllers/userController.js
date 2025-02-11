const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const User = require("../models/user");

exports.AddUser = async (req, res) => {
    const { name, email, password, roleId } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const item = await User.create({ name, email, password: hashedPassword, roleId });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.UpdateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, roleId } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const item = await User.findByPk(id);
        if (item) {
            item.name = name;
            item.email = email;
            item.password = hashedPassword;
            item.roleId = roleId;
            await item.save();
            res.json(item);
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.UpdateProfile = async (req, res) => {
    const { email, oldPassword, password } = req.body;
    
    try {
        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            const isMatch = await bcrypt.compare(oldPassword, existingUser.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }
            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // 4. Update the password securely
            const [updated] = await User.update(
                { password: hashedPassword }, 
                { where: { email } }
            );
            
            if (updated) {
                const updatedUser = await User.findOne({ where: { email }, attributes: ['id', 'email'] });
                return res.status(200).json({ success: true, message: 'Password updated successfully', user: updatedUser });
            }

            return res.status(400).json({ error: 'Failed to update password' });
        } else {
            return res.status(400).json({ error: 'User is not existed!' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.DeleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await User.findByPk(id);
        if (item) {
            await item.destroy();
            res.status(204).end();
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.FindAllUser = async (req, res) => {
    const { page, limit, search, sortBy, sortDesc } = req.query;
    const offset = (page - 1) * limit;
    const whereClause = search ? {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ]
      } : {};
      const order = sortBy ? [
        [sortBy, (sortDesc === 'true' ) ? 'DESC' : 'ASC']
      ] : [];

    try {
        const { count, rows } = await User.findAndCountAll({
            where: whereClause,
            order: order,
            limit: parseInt(limit),
            offset: parseInt(offset),
        });
        res.json({
            data: rows,
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
