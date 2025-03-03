const { Op, Sequelize } = require('sequelize');
const SubDomain = require("../models/subdomain");
const AccountIds = require("../models/accountId");

exports.findAllSubDomain = async (req, res) => {
    const { page, limit, search, sortBy, sortDesc } = req.query;
    const offset = (page - 1) * limit;
    const whereClause = search ? {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { account_id: { [Op.like]: `%${search}%` } },
          { content: { [Op.like]: `%${search}%` } }
        ]
      } : {};
    const order = sortBy ? [
      [sortBy, (sortDesc === 'true' ) ? 'DESC' : 'ASC']
    ] : [];

    try {
      // Step 1: Get the total distinct count (without limit/offset)
      const totalCount = await SubDomain.count({
        where: whereClause,
        distinct: true, // Ensure distinct count
        col: 'zone_id', // Count distinct zone_id combinations
        group: ['zone_id', 'account_id', 'name'], // Group by these fields
      });
     
      // Step 2: Fetch paginated distinct records
      const rows = await SubDomain.findAll({
        where: whereClause, // Apply filtering
        attributes: [
          [Sequelize.fn('MAX', Sequelize.col('subdomains.id')), 'id'], // Get latest record ID per group
          'zone_id',
          'account_id',
          'name',
          [Sequelize.fn('MAX', Sequelize.col('subdomains.created_on')), 'created_on'], // Get latest createdAt per group
          [Sequelize.fn('MAX', Sequelize.col('subdomains.modified_on')), 'modified_on'], // Get latest createdAt per group
          [Sequelize.fn('MAX', Sequelize.col('subdomains.content')), 'content'], // Get latest createdAt per group
          [Sequelize.fn('MAX', Sequelize.col('subdomains.type')), 'type'], // Get latest createdAt per group
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
        group: ['zone_id', 'account_id', 'name'], // Grouping to get distinct results
        order: [
          [Sequelize.fn('MAX', Sequelize.col('subdomains.createdAt')), 'DESC'], // Order by most recent createdAt
        ],
        limit: parseInt(limit), // Apply pagination
        offset: parseInt(offset), // Apply pagination
      });
      
      res.json({
          data: rows,
          total: totalCount.length,
          page: parseInt(page),
          limit: parseInt(limit),
      });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
