const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');
const { requireAuth, requireRole } = require('../middlewares/auth');

router.get('/', requireAuth, farmerController.index);
router.get('/create', requireAuth, requireRole('admin', 'petugas'), farmerController.createForm);
router.post('/create', requireAuth, requireRole('admin', 'petugas'), farmerController.create);
router.get('/:id', requireAuth, farmerController.detail);
router.get('/:id/edit', requireAuth, requireRole('admin', 'petugas'), farmerController.editForm);
router.post('/:id/edit', requireAuth, requireRole('admin', 'petugas'), farmerController.update);
router.post('/:id/verify', requireAuth, requireRole('admin', 'petugas'), farmerController.verify);
router.post('/:id/approve', requireAuth, requireRole('admin', 'pimpinan'), farmerController.approve);
router.post('/:id/delete', requireAuth, requireRole('admin'), farmerController.delete);

module.exports = router;
