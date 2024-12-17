const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const Server = require("../models/server");
const Dashboard = require("../models/dashboard");
const axios = require('axios');

exports.runDailyTask = async () => {
    try {
      console.log("Running daily task at 00:00...");

      const serverList = await Server.findAll();

      const itemsVPSSeo1 = serverList.filter(item => item.team === 'seo-1');
      const itemsVPSSeo2 = serverList.filter(item => item.team === 'seo-2');
      const itemsVPSSeo3 = serverList.filter(item => item.team === 'seo-3');
      const itemsVPSSeo4 = serverList.filter(item => item.team === 'seo-4');

      let totalSiteSEO1 = 0;
      let totalSiteSEO2 = 0;
      let totalSiteSEO3 = 0;
      let totalSiteSEO4 = 0;

      for (let i = 0; i < itemsVPSSeo1.length; i++) {
        let amountDomain = await this.fetchDomainAmount({
          team: itemsVPSSeo1[i].team,
          server_ip: itemsVPSSeo1[i].server_ip,
        });
        if (amountDomain && amountDomain.status === 'success') {
          totalSiteSEO1 += amountDomain.result.success;
        }
      }
      await this.saveToDashboard({ team: 'seo-1', totalSite: totalSiteSEO1 });

      for (let i = 0; i < itemsVPSSeo2.length; i++) {
        let amountDomain = await this.fetchDomainAmount({
          team: itemsVPSSeo2[i].team,
          server_ip: itemsVPSSeo2[i].server_ip,
        });
        if (amountDomain && amountDomain.status === 'success') {
          totalSiteSEO2 += amountDomain.result.success;
        }
      }
      await this.saveToDashboard({ team: 'seo-2', totalSite: totalSiteSEO2 });

      for (let i = 0; i < itemsVPSSeo3.length; i++) {
        let amountDomain = await this.fetchDomainAmount({
          team: itemsVPSSeo3[i].team,
          server_ip: itemsVPSSeo3[i].server_ip,
        });
        if (amountDomain && amountDomain.status === 'success') {
          totalSiteSEO3 += amountDomain.result.success;
        }
      }
      await this.saveToDashboard({ team: 'seo-3', totalSite: totalSiteSEO3 });

      for (let i = 0; i < itemsVPSSeo4.length; i++) {
        let amountDomain = await this.fetchDomainAmount({
          team: itemsVPSSeo4[i].team,
          server_ip: itemsVPSSeo4[i].server_ip,
        });
        if (amountDomain && amountDomain.status === 'success') {
          totalSiteSEO4 += amountDomain.result.success;
        }
      }
      await this.saveToDashboard({ team: 'seo-4', totalSite: totalSiteSEO4 });

      console.log("Daily task completed successfully.");
    } catch (error) {
      console.error("Error in daily task:", error.message);
    }
};

exports.fetchDomainAmount = async ({ team, server_ip }) => {
  const apiUrl = process.env.API_URL_SCRIPT;
  try {
    let params = { team: team, server_ip: server_ip };

    const response = await axios.get(`${apiUrl}/count-domains`, {
      params,
      headers: {
        Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
      },
    });

    return response.data; // Trả về dữ liệu thành công
  } catch (error) {
    console.error(`Error fetching domain amount for ${server_ip}:`, error.message);
    return null; // Trả về null nếu có lỗi
  }
};

exports.saveToDashboard = async ({ team, totalSite }) => {
  const existingTeam = await Dashboard.findOne({ where: { team } });
  if (existingTeam) {
      await existingTeam.update({ team: team, total_sites: totalSite });
  } else {
      await Dashboard.create({ team: team, total_sites: totalSite });
  }
};

exports.FindAllDashboard = async (req, res) => {
    const { page, limit, search, sortBy, sortDesc } = req.query;
    const offset = (page - 1) * limit;
    const whereClause = search ? {
        [Op.or]: [
            { team: { [Op.like]: `%${search}%` } },
        ]
      } : {};
      const order = sortBy ? [
        [sortBy, (sortDesc === 'true' ) ? 'DESC' : 'ASC']
      ] : [];

    try {
        const { count, rows } = await Dashboard.findAndCountAll({
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

