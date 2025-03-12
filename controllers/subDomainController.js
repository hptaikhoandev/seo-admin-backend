const { Op, Sequelize } = require('sequelize');
const axios = require('axios');
const SubDomain = require("../models/subdomain");
const AccountIds = require("../models/accountId");


exports.findAllSubDomain = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, sortBy, sortDesc, team } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Define Search Filter
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

        let totalCountWhereClause = [];
        let replacements = {};

        // Add Team Filtering (Skip if "seo-admin")
        if (team && team !== "admin") {
            totalCountWhereClause.push("sub.account_id IN (SELECT account_id FROM accountIds WHERE team = :team)");
            replacements.team = team;
        }

        // Add Search Filtering
        if (search) {
            totalCountWhereClause.push(`
                (sub.name LIKE :search
                OR sub.account_id LIKE :search
                OR sub.content LIKE :search)
            `);
            replacements.search = `%${search}%`;
        }

        // Build Final WHERE Clause (If Filters Exist)
        const whereSQL = totalCountWhereClause.length ? `WHERE ${totalCountWhereClause.join(" AND ")}` : "";

        // Step 2: Build Dynamic SQL Query for Total Count
        const totalCountQuery = `
            SELECT COUNT(DISTINCT sub.zone_id, sub.account_id, sub.name) AS total
            FROM subdomains AS sub
            ${whereSQL}
        `;

        // Step 3: Execute the Query
        const totalCountResult = await SubDomain.sequelize.query(totalCountQuery, {
            replacements,
            type: Sequelize.QueryTypes.SELECT,
        });

        const totalCount = totalCountResult[0]?.total || 0;

        // Step: Fetch Paginated Distinct Records (Filters by `team` unless it's "seo-admin")
        const rows = await SubDomain.findAll({
            where: whereClause,
            attributes: [
                [Sequelize.fn('MAX', Sequelize.col('subdomains.id')), 'id'], // Get latest record ID per group
                'zone_id',
                'account_id',
                'name',
                [Sequelize.fn('MAX', Sequelize.col('subdomains.created_on')), 'created_on'], // Get latest createdOn per group
                [Sequelize.fn('MAX', Sequelize.col('subdomains.modified_on')), 'modified_on'], // Get latest modifiedOn per group
                [Sequelize.fn('MAX', Sequelize.col('subdomains.content')), 'content'], // Get latest content per group
                [Sequelize.fn('MAX', Sequelize.col('subdomains.dns_id')), 'dns_id'], // Get latest content per group
                [Sequelize.fn('MAX', Sequelize.col('subdomains.domain')), 'domain'], // Get latest content per group
                [Sequelize.fn('MAX', Sequelize.col('subdomains.type')), 'type'], // Get latest type per group
                [Sequelize.fn('MAX', Sequelize.col('subdomains.createdAt')), 'createdAt'], // Get latest createdAt per group
                [Sequelize.literal('(SELECT email FROM accountIds WHERE accountIds.account_id = subdomains.account_id LIMIT 1)'), 'email'],
                [Sequelize.literal('(SELECT team FROM accountIds WHERE accountIds.account_id = subdomains.account_id LIMIT 1)'), 'team'],
                [Sequelize.fn('COUNT', Sequelize.col('subdomains.id')), 'record_count'], // Count the number of records per group
                [
                    Sequelize.literal(`
                        (
                            SELECT sub.content 
                            FROM subdomains AS sub 
                            WHERE sub.account_id = subdomains.account_id 
                            AND sub.zone_id = subdomains.zone_id 
                            AND sub.name = subdomains.name 
                            AND sub.id = (
                                SELECT MAX(s.id) FROM subdomains s 
                                WHERE s.account_id = subdomains.account_id 
                                AND s.zone_id = subdomains.zone_id 
                                AND s.name = subdomains.name
                            )
                            AND sub.content != (
                                SELECT s.content FROM subdomains s 
                                WHERE s.id = (
                                    SELECT MAX(s2.id) FROM subdomains s2 
                                    WHERE s2.account_id = subdomains.account_id 
                                    AND s2.zone_id = subdomains.zone_id 
                                    AND s2.name = subdomains.name
                                )
                            )
                            ORDER BY sub.createdAt DESC 
                            LIMIT 1
                        )
                    `), 'old_content'
                ],
            ],
            group: ['zone_id', 'account_id', 'name'],
            order: [[Sequelize.fn('MAX', Sequelize.col('subdomains.createdAt')), 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
            having: team && team !== "admin"
                ? Sequelize.literal(`(SELECT team FROM accountIds WHERE accountIds.account_id = subdomains.account_id LIMIT 1) = '${team}'`)
                : undefined, // Filters team inside `findAll()` unless team is "seo-admin"
        });

        res.json({
            data: rows,
            total: totalCount,
            page: parseInt(page),
            limit: parseInt(limit),
        });

    } catch (error) {
        console.error("Error in findAllSubDomain:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.findListSubDomainHistory = async (req, res) => {
  const { page, limit, search, sortBy, sortDesc, name, zone_id, account_id, current_id } = req.query;
  const offset = (page - 1) * limit;
  const whereClause = {
      [Op.and]: [
        { name: name},
        { account_id: account_id},
        { zone_id: zone_id},
        { id: { [Op.ne]: current_id}}
      ]
    }

  const latestIdsQuery = `
    SELECT MAX(id) AS id
    FROM subdomains
    WHERE name = :name
    AND account_id = :account_id
    AND zone_id = :zone_id
    GROUP BY name, account_id, zone_id, modified_on
  `;

  const latestIds = await SubDomain.sequelize.query(latestIdsQuery, {
    replacements: { name, account_id, zone_id },
    type: Sequelize.QueryTypes.SELECT,
  });

  const latestIdsArray = latestIds.map(row => row.id);

  const { count, rows } = await SubDomain.findAndCountAll({
    where: { id: { [Op.in]: latestIdsArray } }, // Filter by latest IDs
    order: [['modified_on', 'DESC']], // Show newest records first
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  try {
    res.json({
      data: rows,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
  });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.updateSubDomain = async (req, res) => {
    const { id } = req.params;
    const { dns_id, zone_id, content, name, account_id } = req.body;
    const result = { "success": 0, "fail": { "count": 0, "messages": [] }, "messages": [] };

    try {
        let apiUrl = process.env.API_URL_SCRIPT;
        let params = { id: id, dns_id: dns_id, zone_id: zone_id, content: content, name: name, account_id: account_id };
       
        apiUrl = apiUrl + '/update-dns-record';

        const apiResponse = await axios.post(`${apiUrl}`,
            params, {
            headers: {
              Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
            },
          });
        
        if (apiResponse.status === 200 && apiResponse.data.status === "success") {
            result.success += 1;
            return res.status(200).json({
                status: "success",
                message: "DNS records updated successfully.",
                result: result,
            });
        } else {
            result.fail.count += 1;
            result.fail.messages.push(apiResponse.data.message || "DNS records cập nhật bị lỗi");
            return res.status(apiResponse.status || 500).json({
                status: "success",
                result: result,
            });
        }
    } catch (error) {
        console.log(error)
        result.fail.count += 1;
        result.fail.messages.push("Internal Server Error");
        return res.status(500).json({
            status: "error",
            result: result,
        });
    }
};