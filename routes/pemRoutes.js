const express = require('express')
const router = express.Router();
const pemController = require('../controllers/pemController')
const { auth } = require('../middleware/auth');

router.get('/', auth, pemController.FindAllPem);
router.post('/', auth, pemController.AddPem);
router.put('/:id', auth, pemController.UpdatePem);
router.delete('/:id', auth, pemController.DeletePem);

module.exports = router;