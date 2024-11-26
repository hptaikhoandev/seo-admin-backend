const express = require('express')
const router = express.Router();
const serverController = require('../controllers/serverController')
const { auth } = require('../middleware/auth');

router.get('/', auth, serverController.FindAllServer);
router.post('/', auth, serverController.AddServer);
router.put('/:id', auth, serverController.UpdateServer);
router.delete('/:id', auth, serverController.DeleteServer);

module.exports = router;