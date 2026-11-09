const express = require('express');
const router = express.Router();
const aidController = require('../controllers/aidController');
const { requireAuth, requireRole } = require('../middlewares/auth');

router.get('/', requireAuth, aidController.index);
router.get('/programs/:id', requireAuth, aidController.programDetail);
router.get('/disburse', requireAuth, requireRole('admin', 'petugas'), aidController.disburseForm);
router.post('/disburse', requireAuth, requireRole('admin', 'petugas'), aidController.saveDisburse);

module.exports = router;
