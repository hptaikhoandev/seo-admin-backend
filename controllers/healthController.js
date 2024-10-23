const os = require('os');
const { format } = require('date-fns');
const { Sequelize } = require('sequelize');

const checkMySQLStatus = async() => {
  try {
    // Kết nối tới MySQL in host db
    const sequelize = new Sequelize('seo-admin-backend', 'root', 'drowssapAmin', {
      host: 'db',
      dialect: 'mysql',
    });
    await sequelize.authenticate();
    await sequelize.close();
    return true;
  } catch (error) { 
    if (error.toString().includes('HostNotFoundError')) {
      // Kết nối tới MySQL in host localhost
      const sequelize = new Sequelize('seo-admin-backend', 'root', 'drowssapAmin', {
        host: 'localhost',
        dialect: 'mysql',
      });
      await sequelize.authenticate();
      await sequelize.close();
      return true;
    } else {
      console.error('Unable to connect to the database:', error);
      return false;
    }
  }
}
exports.healthCheck = async (req, res) => {
  try {
    const healthCheck = {
      uptime: process.uptime(),
      message: 'Health Check Status',
      timestamp: format(new Date(), 'yyyy-MM-dd:HH:mm:ss'),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      platform: os.platform(),
      loadAverage: os.loadavg(),
      MySQLDbServerStatus: (checkMySQLStatus()) ? 'Connected - OK' : 'Disonnected - Error',
    };
    return res.status(200).json(healthCheck).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};










