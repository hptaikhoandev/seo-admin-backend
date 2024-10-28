const { Op } = require('sequelize');
const DomainService = require("../services/domainService");

exports.AddDomain = async (req, res) => {
    console.log('=====>okkkk', req.body);
    const { name, userId, ns, status } = req.body;
    try {
        const item = await Domain.create({ name, userId, ns, status });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.UpdateDomain = async (req, res) => {
    const { id } = req.params;
    const { name, userId, ns, status } = req.body;
    try {
        const item = await Domain.findByPk(id);
        if (item) {
            item.name = name;
            item.userId = userId;
            item.ns = ns;
            item.status = status;
            await item.save();
            res.json(item);
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.DeleteDomain = async (req, res) => {
    const { id } = req.params;
    const { name, userId } = req.body;
    try {
        const item = await Domain.findByPk(id);
        if (item) {
            await item.destroy();
            res.status(204).end();
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.FindAllDomain = async (req, res) => {
    const { page, limit, search, sortBy, sortDesc } = req.query;
    const offset = (page - 1) * limit;
    const whereClause = search ? {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { status: { [Op.like]: `%${search}%` } }
        ]
      } : {};
      const order = sortBy ? [
        [sortBy, (sortDesc === 'true' ) ? 'DESC' : 'ASC']
      ] : [];

    try {
        const { count, rows } = await Domain.findAndCountAll({
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
// exports.SendSMS = async (req, res) => {
//     const domainService = new DomainService();
//     const { domainList, messageList } = req.body;
//     console.log('=====>uuu', domainList, messageList);
//     try {
//         await domainService.SendSMS({
//             domainList, 
//             messageList
//         });
//         res.json({
//             status: 'ok',
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
