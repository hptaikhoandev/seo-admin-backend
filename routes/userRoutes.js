const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController')
const { auth } = require('../middleware/auth');

router.get('/', auth, userController.FindAllUser);
router.post('/', auth, userController.AddUser);
router.put('/:id', auth, userController.UpdateUser);
router.delete('/:id', auth, userController.DeleteUser);

module.exports = router;