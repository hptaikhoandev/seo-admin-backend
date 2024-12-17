const express = require('express')
const router = express.Router();
const taskController = require('../controllers/taskController')
const { auth } = require('../middleware/auth');

router.get('/', auth, taskController.FindAllDashboard);

module.exports = router;