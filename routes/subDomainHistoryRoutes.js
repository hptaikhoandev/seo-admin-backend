const express = require('express')
const router = express.Router();
const subDomainHistoryController = require('../controllers/subDomainHistoryController.js')
const { auth } = require('../middleware/auth');

router.get('/', auth, subDomainHistoryController.findAllSubDomainHistory);
router.get('/last-subdomain', auth, subDomainHistoryController.findLastSubDomainHistory);
router.post('/', auth, subDomainHistoryController.createSubDomainHistory);

module.exports = router;