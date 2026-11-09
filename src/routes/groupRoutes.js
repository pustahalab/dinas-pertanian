const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { requireAuth } = require('../middlewares/auth');

router.get('/', requireAuth, groupController.index);
router.get('/:id', requireAuth, groupController.detail);

module.exports = router;
