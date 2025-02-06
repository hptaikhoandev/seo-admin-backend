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
        const apiResponse = await axios.post(`${apiUrl}/add-server-domains`, { server_ip, team });
        if (apiResponse.status === 200 && apiResponse.data.status === "success") {
            const public_ip = apiResponse.data.data.public_ip;
            const cpu = apiResponse.data.data.cpu;
            const ram = apiResponse.data.data.ram;
            const site = apiResponse.data.data.site;

            // Tạo bản ghi trong Server table với private_key dựa vào team trong Pem table
            let private_key = "";
            const pemRecord = await Pem.findOne({where: { team: team },});
            if (pemRecord) private_key = pemRecord.pem;
            await Server.create({ server_ip: public_ip, team, cpu: cpu, ram: ram, site: site, key_name: `${team}_${public_ip}`, private_key });

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
        console.error("Error in AddServer:", error.message);
        // Trả về lỗi nếu xảy ra
        result.fail.count += 1
        result.fail.messages.push("Internal Server Error")
        return res.status(500).json({
            status: "error",
            result: result,
        });
    }
};
exports.AddServerImport = async (req, res) => {
    const { server_ip, team, private_key, username, authMethod } = req.body;
    const result = { "success": 0, "fail": { "count": 0, "messages": [] } };

    try {
        let apiUrl = process.env.API_URL_SCRIPT;
        let params = { server_ip: server_ip, team: team, username: username, private_key: private_key };
        if (authMethod == 'SSH') {
            apiUrl = apiUrl + '/param-dashboard-ssh';
        } else {{
            apiUrl = apiUrl + '/param-dashboard';
        }}
    
        const apiResponse = await axios.get(`${apiUrl}`, {
            params,
            headers: {
              Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
            },
          });
      
        if (apiResponse.status === 200 && apiResponse.data.status === "success") {
            console.log("===>site", apiResponse.data.data.site);

            const cpu = apiResponse.data.data.cpu;
            const ram = apiResponse.data.data.ram / 1024;
            const sites = apiResponse.data.data.site;

            const key_name = `${team}_${server_ip}`;
            // Kiểm tra xem key_name đã tồn tại chưa
            const existingServer = await Server.findOne({ where: { key_name } });
            if (existingServer) {
                // Nếu tồn tại, cập nhật bản ghi
                await existingServer.update({ server_ip, team, cpu, ram, sites, private_key });
                result.success += 1;
                return res.status(200).json({
                    status: "success",
                    message: "Server updated successfully.",
                    result: result,
                });
            } else {
                // Nếu không tồn tại, tạo mới bản ghi
                await Server.create({ server_ip, team, cpu, ram, sites, key_name, username, authMethod, private_key });
                result.success += 1;
                return res.status(200).json({
                    status: "success",
                    message: "Server created successfully.",
                    result: result,
                });
            }
    
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
        console.error("Error in AddServerImport:", error.message);
        result.fail.count += 1;
        result.fail.messages.push("Internal Server Error");
        return res.status(500).json({
            status: "error",
            result: result,
        });
    }
};


exports.UpdateServer = async (req, res) => {
    const { id } = req.params;
    const { server_ip, team, private_key } = req.body;
    try {
        console.log('===>editedItem', id);
        const item = await Server.findByPk(id);
        if (item) {
            item.team = team;
            item.server_ip = server_ip;
            item.private_key = private_key;
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
          { key_name: { [Op.like]: `%${search}%` } }
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
