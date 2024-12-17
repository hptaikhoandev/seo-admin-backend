const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const Pem = require("../models/pem");
require('dotenv').config(); 
const axios = require('axios');
const { id } = require('date-fns/locale');

exports.AddPem = async (req, res) => {
    const { pem, team } = req.body;
    const result = {"success": 0, "fail": {"count": 0, "messages": []}}

    try {
        const existingTeamPem = await Pem.findOne({ where: { team } });

        if (existingTeamPem) {
            // Nếu tồn tại, cập nhật bản ghi
            await existingTeamPem.update({ pem, team });
            result.success += 1;
            return res.status(200).json({
                status: "success",
                message: "Server updated successfully.",
                result: result,
            });
        } else {
            // Nếu không tồn tại, tạo mới bản ghi
            await Pem.create({ pem, team });
            result.success += 1;
            return res.status(200).json({
                status: "success",
                message: "Server created successfully.",
                result: result,
            });
        }

    } catch (error) {
        // Xử lý lỗi
        console.error("Error in AddPem:", error.message);
        // Trả về lỗi nếu xảy ra
        result.fail.count += 1
        result.fail.messages.push("Internal Server Error")
        return res.status(500).json({
            status: "error",
            result: result,
        });
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

exports.UpdatePem = async (req, res) => {
    const { id } = req.params;
    const { pem, team } = req.body;
    try {
        const item = await Pem.findByPk(id);
        if (item) {
            item.pem = pem;
            item.team = team;
            await item.save();
            res.json(item);
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
            { team: { [Op.like]: `%${search}%` } },
            { fileName: { [Op.like]: `%${search}%` } },
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
