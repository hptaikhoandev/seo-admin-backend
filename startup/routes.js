const express = require("express");
const healthRoutes = require('../routes/healthRoutes');
const authRoutes = require('../routes/authRoutes');
const userRoutes = require('../routes/userRoutes');
const domainRoutes = require('../routes/domainRoutes');
const accountIdRoutes = require('../routes/accountIdRoutes');
const pemRoutes = require('../routes/pemRoutes');
const serverRoutes = require('../routes/serverRoutes');

module.exports = function (app) {
  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ extended: false, limit: '100mb' }));

  app.use('/api/health-check', healthRoutes);
  app.use('/api/auth', authRoutes)
  app.use('/api/users', userRoutes);
  app.use('/api/domains', domainRoutes);
  app.use('/api/accountIds', accountIdRoutes);
  app.use('/api/pems', pemRoutes);
  app.use('/api/servers', serverRoutes);
};
