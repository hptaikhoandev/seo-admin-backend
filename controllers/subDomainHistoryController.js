const { Op, Sequelize } = require('sequelize');
const axios = require('axios');
const SubDomainHistory = require("../models/subdomainHistory");
const AccountIds = require("../models/accountId");

exports.findAllSubDomainHistory = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, sortBy, sortDesc, team } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Define Search Filter for ORM
        const whereClause = search
            ? {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { account_id: { [Op.like]: `%${search}%` } },
                    { content: { [Op.like]: `%${search}%` } }
                ]
            }
            : {};

        // Nếu có team filter và không phải admin
        if (team && team !== "admin") {
            whereClause[Op.and] = whereClause[Op.and] || [];
            whereClause[Op.and].push(
                Sequelize.literal(`account_id IN (SELECT account_id FROM accountIds WHERE team = '${team}')`)
            );
        }

        // Sorting Logic
        const order = sortBy 
            ? [[sortBy, sortDesc === 'true' ? 'DESC' : 'ASC']] 
            : [['created_on', 'DESC']];

        // Đếm tổng số bản ghi theo cùng điều kiện tìm kiếm
        const totalCount = await SubDomainHistory.count({
            where: whereClause,
        });

        // Fetch các bản ghi theo điều kiện
        const rows = await SubDomainHistory.findAll({
            where: whereClause,
            attributes: [
                'id',
                'zone_id',
                'account_id',
                'name',
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('created_on'), '%Y-%m-%d %H:%i:%s'), 'created_on'],
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('modified_on'), '%Y-%m-%d %H:%i:%s'), 'modified_on'],
                'content',
                'dns_id',
                'type',
                [Sequelize.literal('(SELECT email FROM accountIds WHERE accountIds.account_id = subdomainHistory.account_id LIMIT 1)'), 'email'],
                [Sequelize.literal('(SELECT team FROM accountIds WHERE accountIds.account_id = subdomainHistory.account_id LIMIT 1)'), 'team']
            ],
            order: order,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            data: rows,
            total: totalCount,
            page: parseInt(page),
            limit: parseInt(limit),
        });

    } catch (error) {
        console.error("Error in findAllSubDomainHistory:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.findLastSubDomainHistory = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, sortBy, sortDesc, team } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Lấy đối tượng sequelize từ model
        const sequelize = SubDomainHistory.sequelize;

        // Xử lý team filter
        let teamFilter = '';
        let replacements = {};
        
        if (team && team !== "admin") {
            teamFilter = "AND account_id IN (SELECT account_id FROM accountIds WHERE team = :team)";
            replacements.team = team;
        }

        // Xử lý search filter
        let searchFilter = '';
        if (search) {
            searchFilter = `AND (name LIKE :search OR account_id LIKE :search OR content LIKE :search)`;
            replacements.search = `%${search}%`;
        }

        // Tạo tham số order
        const orderColumn = sortBy || 'created_on';
        const orderDirection = sortDesc === 'true' ? 'DESC' : 'ASC';

        // Truy vấn SQL để lấy tổng số bản ghi duy nhất
        const totalCountQuery = `
            SELECT COUNT(*) AS total FROM (
                SELECT MAX(id) as max_id
                FROM subdomainHistory
                WHERE 1=1 ${teamFilter} ${searchFilter}
                GROUP BY zone_id, account_id, name
            ) AS unique_records
        `;

        const totalCountResult = await sequelize.query(totalCountQuery, {
            replacements,
            type: Sequelize.QueryTypes.SELECT
        });

        const totalCount = totalCountResult[0]?.total || 0;

        // Truy vấn SQL để lấy các bản ghi mới nhất cho mỗi nhóm
        const latestRecordsQuery = `
            SELECT sub.*,
                   DATE_FORMAT(sub.created_on, '%Y-%m-%d %H:%i:%s') as formatted_created_on,
                   DATE_FORMAT(sub.modified_on, '%Y-%m-%d %H:%i:%s') as formatted_modified_on,
                   (SELECT email FROM accountIds WHERE accountIds.account_id = sub.account_id LIMIT 1) as email,
                   (SELECT team FROM accountIds WHERE accountIds.account_id = sub.account_id LIMIT 1) as team
            FROM subdomainHistory AS sub
            INNER JOIN (
                SELECT zone_id, account_id, name, MAX(id) as latest_id
                FROM subdomainHistory
                WHERE 1=1 ${teamFilter} ${searchFilter}
                GROUP BY zone_id, account_id, name
            ) as latest ON sub.id = latest.latest_id
            ORDER BY sub.${orderColumn} ${orderDirection}
            LIMIT :limit OFFSET :offset
        `;

        replacements.limit = parseInt(limit);
        replacements.offset = parseInt(offset);

        const rows = await sequelize.query(latestRecordsQuery, {
            replacements,
            type: Sequelize.QueryTypes.SELECT
        });

        // Định dạng lại kết quả để phù hợp với cấu trúc dữ liệu ban đầu
        const formattedRows = rows.map(row => ({
            id: row.id,
            zone_id: row.zone_id,
            account_id: row.account_id,
            name: row.name,
            created_on: row.formatted_created_on,
            modified_on: row.formatted_modified_on,
            content: row.content,
            dns_id: row.dns_id,
            type: row.type,
            email: row.email,
            team: row.team
        }));

        res.json({
            data: formattedRows,
            total: totalCount,
            page: parseInt(page),
            limit: parseInt(limit),
        });

    } catch (error) {
        console.error("Error in findAllSubDomainHistory:", error);
        res.status(500).json({ error: error.message });
    }
}

exports.createSubDomainHistory = async (req, res) => {
    const { dns_id, zone_id, type, content, name, account_id } = req.body;
    const created_on = req.body.created_on || new Date();
    const modified_on = req.body.modified_on || new Date();
    const result = { "success": 0, "fail": { "count": 0, "messages": [] }, "messages": [] };

    try {

        await SubDomainHistory.create({ name, type, content, name, dns_id, zone_id, account_id, created_on: created_on, modified_on: modified_on });

        result.success += 1;
        return res.status(200).json({
            status: "success",
            message: "DNS records created successfully.",
            result: result,
        });
    } catch (error) {
        console.error("Error in addSubDomainHistory:", error);
        result.fail.count += 1;
        result.fail.messages.push("Internal Server Error");
        return res.status(500).json({
            status: "error",
            result: result,
        });
    }
}

exports.getDomainInfo = async (req, res) => {
    const { page = 1, limit = 10, search, sortBy, sortDesc } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    try {
        const whereClause = search
            ? {
                [Op.and]: [
                    {
                        [Op.or]: [
                            { name: { [Op.like]: `%${search}%` } },
                            { account_id: { [Op.like]: `%${search}%` } },
                            { content: { [Op.like]: `%${search}%` } }
                        ]
                    }
                ]
            }
            : {};

        // Sorting Logic
        const order = sortBy ? [[sortBy, sortDesc === 'true' ? 'DESC' : 'ASC']] : [['createdAt', 'DESC']];

        const rows = await AccountIds.findAll({
            where: whereClause,
            attributes: ['account_id', 'name', 'team'],
            order: order,
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        const totalCount = await AccountIds.count({ where: whereClause });

        res.json({
            data: rows,
            total: totalCount,
            page: parseInt(page),
            limit: parseInt(limit),
        });
    } catch (error) {
        console.error("Error in getDomainInfo:", error);
        res.status(500).json({ error: error.message });
    }
}