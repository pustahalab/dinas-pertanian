const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.get('/verify-card/:cardNumber?', apiController.verifyCard);
router.get('/stats', apiController.getStats);

module.exports = router;
