const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { requireAuth } = require('../middlewares/auth');

router.get('/', (req, res) => res.redirect('/dashboard'));
router.get('/dashboard', requireAuth, dashboardController.index);

module.exports = router;
