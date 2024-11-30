const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const AccountId = require("../models/accountId");

exports.AddAccountId = async (req, res) => {
    const { team, account_id, email } = req.body;
    try {
        // Kiểm tra xem bản ghi có tồn tại không
        const existingItem = await AccountId.findOne({ where: { team, email } });

        if (existingItem) {
            // Nếu đã tồn tại, cập nhật account_id
            existingItem.account_id = account_id;
            await existingItem.save();
            return res.status(200).json({
                success: true,
                message: "Account ID updated successfully",
                data: existingItem,
            });
        } else {
            // Nếu không tồn tại, tạo bản ghi mới
            const newItem = await AccountId.create({ team, account_id, email });
            return res.status(201).json({
                success: true,
                message: "New Account ID created successfully",
                data: newItem,
            });
        }
    } catch (error) {
        // Xử lý lỗi
        console.error("Error in AddAccountId:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
exports.UpdateAccountId = async (req, res) => {
    const { id } = req.params;
    const { team, account_id, email } = req.body;
    try {
        const item = await AccountId.findByPk(id);
        if (item) {
            item.team = team;
            item.account_id = account_id;
            item.email = email;
            await item.save();
            res.json(item);
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.DeleteAccountId = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await AccountId.findByPk(id);
        if (item) {
            await item.destroy();
            res.status(204).end();
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.FindAllAccountId = async (req, res) => {
    const { page, limit, search, sortBy, sortDesc } = req.query;
    const offset = (page - 1) * limit;
    const whereClause = search ? {
        [Op.or]: [
          { team: { [Op.like]: `%${search}%` } },
        //   { account_id: { [Op.like]: `%${search}%` } }
        ]
      } : {};
      const order = sortBy ? [
        [sortBy, (sortDesc === 'true' ) ? 'DESC' : 'ASC']
      ] : [];

    try {
        const { count, rows } = await AccountId.findAndCountAll({
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
