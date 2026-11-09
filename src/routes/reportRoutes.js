const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { requireAuth, requireRole } = require('../middlewares/auth');

router.get('/farmers', requireAuth, reportController.farmers);
router.get('/transport', requireAuth, reportController.transport);
router.get('/aids', requireAuth, reportController.aids);

module.exports = router;
