const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const Pem = require("../models/pem");

exports.AddPem = async (req, res) => {
    const { pem, server_ip } = req.body;
    try {
        const item = await Pem.create({ pem, server_ip });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.UpdatePem = async (req, res) => {
    const { id } = req.params;
    const { pem, server_ip } = req.body;
    try {
        const item = await Pem.findByPk(id);
        if (item) {
            item.pem = pem;
            item.server_ip = server_ip;
            await item.save();
            res.json(item);
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.DeletePem = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Pem.findByPk(id);
        if (item) {
            await item.destroy();
            res.status(204).end();
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.FindAllPem = async (req, res) => {
    const { page, limit, search, sortBy, sortDesc } = req.query;
    const offset = (page - 1) * limit;
    const whereClause = search ? {
        [Op.or]: [
          { pem: { [Op.like]: `%${search}%` } },
          { server_ip: { [Op.like]: `%${search}%` } }
        ]
      } : {};
      const order = sortBy ? [
        [sortBy, (sortDesc === 'true' ) ? 'DESC' : 'ASC']
      ] : [];

    try {
        const { count, rows } = await Pem.findAndCountAll({
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
