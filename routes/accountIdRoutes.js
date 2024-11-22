const express = require('express')
const router = express.Router();
const accountIdController = require('../controllers/accountIdController')
const { auth } = require('../middleware/auth');

router.get('/', auth, accountIdController.FindAllAccountId);
router.post('/', auth, accountIdController.AddAccountId);
router.put('/:id', auth, accountIdController.UpdateAccountId);
router.delete('/:id', auth, accountIdController.DeleteAccountId);

module.exports = router;