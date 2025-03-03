const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const Server = require("../models/server");
const Dashboard = require("../models/dashboard");
const SubDomains = require("../models/subdomain");
const axios = require('axios');

exports.runDailyTask = async () => {
    try {
      console.log("Running daily task at 00:00...");

      const serverList = await Server.findAll();

      const itemsVPSSeo1 = serverList.filter(item => item.team === 'seo-1');
      const itemsVPSSeo2 = serverList.filter(item => item.team === 'seo-2');
      const itemsVPSSeo3 = serverList.filter(item => item.team === 'seo-3');
      const itemsVPSSeo4 = serverList.filter(item => item.team === 'seo-4');
      const serverIpsSeo1 = itemsVPSSeo1.map(item => item.server_ip);
      const serverIpsSeo2 = itemsVPSSeo2.map(item => item.server_ip);
      const serverIpsSeo3 = itemsVPSSeo3.map(item => item.server_ip);
      const serverIpsSeo4 = itemsVPSSeo4.map(item => item.server_ip);
  
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
          sites= amountDomain.result.success;
          await this.saveToDashboard({ team: itemsVPSSeo1[0]?.team ?? '', server_ip: itemsVPSSeo1[i].server_ip, sites: sites });
          await this.saveToServer({ team: itemsVPSSeo1[0]?.team ?? '', server_ip: itemsVPSSeo1[i].server_ip, sites: sites });
        }
      }

      for (let i = 0; i < itemsVPSSeo2.length; i++) {
        let amountDomain = await this.fetchDomainAmount({
          team: itemsVPSSeo2[i].team,
          server_ip: itemsVPSSeo2[i].server_ip,
        });
        if (amountDomain && amountDomain.status === 'success') {
            sites= amountDomain.result.success;
            await this.saveToDashboard({ team: itemsVPSSeo2[0]?.team ?? '', server_ip: itemsVPSSeo2[i].server_ip, sites: sites });
            await this.saveToServer({ team: itemsVPSSeo2[0]?.team ?? '', server_ip: itemsVPSSeo2[i].server_ip, sites: sites });
          }
      }

      for (let i = 0; i < itemsVPSSeo3.length; i++) {
        let amountDomain = await this.fetchDomainAmount({
          team: itemsVPSSeo3[i].team,
          server_ip: itemsVPSSeo3[i].server_ip,
        });
        if (amountDomain && amountDomain.status === 'success') {
            sites= amountDomain.result.success;
            await this.saveToDashboard({ team: itemsVPSSeo3[0]?.team ?? '', server_ip: itemsVPSSeo3[i].server_ip, sites: sites });
            await this.saveToServer({ team: itemsVPSSeo3[0]?.team ?? '', server_ip: itemsVPSSeo3[i].server_ip, sites: sites });
          }
      }

      for (let i = 0; i < itemsVPSSeo4.length; i++) {
        let amountDomain = await this.fetchDomainAmount({
          team: itemsVPSSeo4[i].team,
          server_ip: itemsVPSSeo4[i].server_ip,
        });
        if (amountDomain && amountDomain.status === 'success') {
            sites= amountDomain.result.success;
            await this.saveToDashboard({ team: itemsVPSSeo4[0]?.team ?? '', server_ip: itemsVPSSeo4[i].server_ip, sites: sites });
            await this.saveToServer({ team: itemsVPSSeo4[0]?.team ?? '', server_ip: itemsVPSSeo4[i].server_ip, sites: sites });
          }
      }

      let dnsRecords = await this.fetchDNSRecords({});
      
      if (dnsRecords && dnsRecords.status === 'success') {
        const filteredData = dnsRecords["results"].map(record => {
          const { id, ...dataWithoutId } = record; // Destructure to remove 'id'
          return dataWithoutId;
        });
        this.saveListDataToSubDomain(filteredData);
        this.deleteOldSubDomains();
        
      }
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


exports.fetchDNSRecords = async ({}) => {
  const apiUrl = process.env.API_URL_SCRIPT;
  try {
    
    let params = { server_ip_list: '' };
    console.log("--------------------")
    const response = await axios.get(`${apiUrl}/get-dns-records`, {
      params,
      headers: {
        Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
      },
    });
    return response.data; // Trả về dữ liệu thành công
  } catch (error) {
    console.error(`Error fetching domain amount for ${serverIPList}:`, error.message);
    return null; // Trả về null nếu có lỗi
  }
};

exports.saveListDataToSubDomain = async (listData) => {
  try {
    SubDomains.bulkCreate(listData);
  } catch (error) {
    console.error('Error deleting old SubDomains:', error);
  }
  // try {
  //   for (const data of listData) {
  //     const { account_id, name, content, zone_id } = data;
  //     const existingSubDomain = await SubDomains.findOne({ where: { account_id, name, zone_id } });
  //     if (existingSubDomain) {
  //       if (content !== existingSubDomain.content) {
  //         existingSubDomain.update({ content: content, old_content: existingSubDomain.content });
  //       }
  //     } else {
  //       SubDomains.create(data);
  //     }
  //   }
  // } catch (error) {
  //   console.error('Error deleting old SubDomains:', error);
  // }
};

exports.deleteOldSubDomains = () => {
  try {
    // Calculate the date one month ago from today
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Delete records that are older than one month
    SubDomains.destroy({
      where: {
        createdAt: {
          [Op.lt]: oneMonthAgo, // Find records with 'createdAt' before the calculated date
        },
      },
    });
  } catch (error) {
    console.error('Error deleting old SubDomains:', error);
  }
};

exports.saveToDashboard = async ({ team, server_ip, sites }) => {
  const existingTeam = await Dashboard.findOne({ where: { team, server_ip } });
  if (existingTeam) {
      await existingTeam.update({ team: team, server_ip, sites });
  } else {
      await Dashboard.create({ team: team, server_ip, sites });
  }
};
exports.saveToServer = async ({ team, server_ip, sites }) => {
  const existingServer = await Server.findOne({ where: { team, server_ip } });
  if (existingServer) {
      await existingServer.update({ team: team, server_ip, sites });
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

