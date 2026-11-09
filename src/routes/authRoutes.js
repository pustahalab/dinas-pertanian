const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { redirectIfAuth, requireAuth } = require('../middlewares/auth');

router.get('/login', redirectIfAuth, authController.showLogin);
router.post('/login', redirectIfAuth, authController.login);
router.get('/quick-login/:role', authController.quickLogin);
router.get('/logout', requireAuth, authController.logout);

module.exports = router;
