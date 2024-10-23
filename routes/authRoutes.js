const express = require('express')
const router = express.Router();
const authController = require('../controllers/authController')
const { auth } = require('../middleware/auth');
const { validateLogin } = require('../middleware/validateLogin');
const { validateRegister } = require('../middleware/validateRegister');
const { checkRole } = require('../middleware/checkRole');
const { checkUserAccess } = require('../middleware/checkUserAccess');

// router.post('/register', auth, checkRole(['admin', 'user']), authController.Register);
router.post('/register', validateRegister, authController.Register);
router.post('/login', validateLogin, authController.Login);
router.post('/logout', auth, authController.Logout);

module.exports = router;