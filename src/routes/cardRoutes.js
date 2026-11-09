const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const { requireAuth } = require('../middlewares/auth');

router.get('/preview/:id', requireAuth, cardController.preview);
router.get('/print-batch', requireAuth, cardController.printBatch);

module.exports = router;
