const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();


router.get('/google', authController.googleLogin);
router.get('/google/callback', authController.googleLoginCallback);
router.get('/facebook', authController.facebookLogin);
router.get('/facebook/callback', authController.facebookLoginCallback);


module.exports = router;