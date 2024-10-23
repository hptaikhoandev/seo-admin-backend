const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

/**
 * @swagger
 * /health-check:
 *   get:
 *     summary: Health check services from system
 *     description: Returns a object with the status of the server
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/', healthController.healthCheck);

module.exports = router;
