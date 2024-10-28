const express = require('express')
const router = express.Router();
const domainController = require('../controllers/domainController')
const { auth } = require('../middleware/auth');

router.get('/', auth, domainController.FindAllDomain);
router.post('/', auth, domainController.AddDomain);
router.put('/:id', auth, domainController.UpdateDomain);
router.delete('/:id', auth, domainController.DeleteDomain);

module.exports = router;