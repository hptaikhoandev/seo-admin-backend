const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const AccountId = require("../models/accountId");

exports.AddAccountId = async (req, res) => {
    const { team, account_id, email } = req.body;
    try {
        const item = await AccountId.create({ team, account_id, email });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
          { account_id: { [Op.like]: `%${search}%` } }
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
