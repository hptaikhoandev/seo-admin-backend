const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const Server = require("../models/server");

exports.AddServer = async (req, res) => {
    const { server_ip, team } = req.body;
    try {
        const item = await Server.create({ server_ip, team });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.UpdateServer = async (req, res) => {
    const { id } = req.params;
    const { server_ip, team } = req.body;
    try {
        const item = await Server.findByPk(id);
        if (item) {
            item.team = team;
            item.server_ip = server_ip;
            await item.save();
            res.json(item);
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.DeleteServer = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Server.findByPk(id);
        if (item) {
            await item.destroy();
            res.status(204).end();
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.FindAllServer = async (req, res) => {
    const { page, limit, search, sortBy, sortDesc } = req.query;
    const offset = (page - 1) * limit;
    const whereClause = search ? {
        [Op.or]: [
          { team: { [Op.like]: `%${search}%` } },
          { server_ip: { [Op.like]: `%${search}%` } }
        ]
      } : {};
      const order = sortBy ? [
        [sortBy, (sortDesc === 'true' ) ? 'DESC' : 'ASC']
      ] : [];

    try {
        const { count, rows } = await Server.findAndCountAll({
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
