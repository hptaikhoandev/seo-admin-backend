const express = require('express')
const router = express.Router();
const subDomainController = require('../controllers/subDomainController')
const { auth } = require('../middleware/auth');

router.get('/', auth, subDomainController.findAllSubDomain);
router.get('/find-list-subdomain-history', auth, subDomainController.findListSubDomainHistory);

module.exports = router;