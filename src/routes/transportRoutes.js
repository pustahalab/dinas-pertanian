const express = require('express');
const router = express.Router();
const transportController = require('../controllers/transportController');
const { requireAuth, requireRole } = require('../middlewares/auth');

router.get('/scanner', requireAuth, requireRole('admin', 'damri', 'petugas'), transportController.scanner);
router.get('/record', requireAuth, requireRole('admin', 'damri', 'petugas'), transportController.recordForm);
router.post('/record', requireAuth, requireRole('admin', 'damri', 'petugas'), transportController.saveRecord);
router.get('/history', requireAuth, transportController.history);

module.exports = router;
