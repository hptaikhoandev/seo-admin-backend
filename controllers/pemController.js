const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const Pem = require("../models/pem");
require('dotenv').config(); 
const axios = require('axios');
const { id } = require('date-fns/locale');

exports.AddPem = async (req, res) => {
    const { team } = req.body;
    const result = {"success": 0, "fail": {"count": 0, "messages": []}}
    try {
        const apiUrl = process.env.API_URL_SCRIPT;
        // Gọi API và chờ kết quả trả về
        const apiResponse = await axios.post(`${apiUrl}/add-pem-key`, { team });
        // Xử lý phản hồi từ API
        if (apiResponse.status === 200 && apiResponse.data.status === "success") {
            const pemContent = apiResponse.data.data.PrivateKey;
            // Tạo bản ghi trong cơ sở dữ liệu
            const item = await Pem.create({ pem: pemContent, team });
            // Trả về kết quả thành công
            result.success += 1
            return res.status(200).json({
                status: "success",
                result: result,
            });
        } else {
            // Trường hợp API không trả về thành công
            result.fail.count += 1
            result.fail.messages.push(apiResponse.data.message || "Key pair đã tồn tại")
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
exports.DeletePem = async (req, res) => {
    const { id } = req.params;
    const { team } = req.query;
    const result = {"success": 0, "fail": {"count": 0, "messages": []}}
    try {
        const apiUrl = process.env.API_URL_SCRIPT;

        // Gọi API và chờ kết quả trả về
        const apiResponse = await axios.post(`${apiUrl}/delete-pem-key`, { team });
        // Xử lý phản hồi từ API
        if (apiResponse.status === 200 && apiResponse.data.status === "success") {
                const item = await Pem.findByPk(id);
                if (item) {
                    await item.destroy();
                    result.success += 1
                    return res.status(200).json({
                        status: "success",
                        result: result,
                    });
                } else {
                    // Trường hợp không tìm thấy bản ghi
                    result.fail.count += 1
                    result.fail.messages.push("Dữ liệu trên databse không tồn tại")
                    return res.status(404).json({
                        status: "success",
                        result: result,
                    });
                }
        } else {
            // Trường hợp API không trả về thành công
            result.fail.count += 1
            result.fail.messages.push(apiResponse.data.message || "Key pair không tồn tại")
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
