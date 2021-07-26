const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/', authController.isLoggedIn, authController.home);
router.get('/login', authController.isLoggedOut, authController.getLogin);
router.post('/login', authController.loginLocal);
router.get('/logout', authController.logout);
router.get('/signup', authController.signup);

module.exports = router;