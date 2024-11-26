const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const Server = require("../models/server");
const Pem = require("../models/pem");
const axios = require('axios');

// exports.AddServer = async (req, res) => {
//     const { server_ip, team } = req.body;
//     try {
//         const item = await Server.create({ server_ip, team });
//         res.status(201).json(item);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
exports.AddServer = async (req, res) => {
    const { server_ip, team } = req.body;
    const result = {"success": 0, "fail": {"count": 0, "messages": []}}
    try {
        const apiUrl = process.env.API_URL_SCRIPT;
        // Gọi API và chờ kết quả trả về
        const apiResponse = await axios.post(`${apiUrl}/add-server-domains`, { server_ip, team });
        // Xử lý phản hồi từ API
        if (apiResponse.status === 200 && apiResponse.data.status === "success") {
            const public_ip = apiResponse.data.data.public_ip;
            const key_name = apiResponse.data.data.key_name;
            const private_key = apiResponse.data.data.private_key;

            // Tạo bản ghi trong cơ sở dữ liệu
            await Server.create({ server_ip: public_ip, team, key_name: `${team}_${public_ip}`, private_key });

            // Trả về kết quả thành công
            result.success += 1
            return res.status(200).json({
                status: "success",
                result: result,
            });
        } else {
            // Trường hợp API không trả về thành công
            result.fail.count += 1
            result.fail.messages.push(apiResponse.data.message || "Server tạo bị lỗi")
            return res.status(apiResponse.status || 500).json({
                status: "success",
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
