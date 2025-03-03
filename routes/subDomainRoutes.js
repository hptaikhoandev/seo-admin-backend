const express = require('express')
const router = express.Router();
const subDomainController = require('../controllers/subDomainController')
const { auth } = require('../middleware/auth');

router.get('/', auth, subDomainController.findAllSubDomain);

module.exports = router;