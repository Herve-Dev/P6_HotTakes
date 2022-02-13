const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const passValidator = require('../middleware/password-validator');
const emailControl = require('../middleware/email-validator');
const limit = require('../middleware/limiter');

router.post('/signup',passValidator, emailControl, userCtrl.signup); // ajout de module de protection comme password validator et validator pour l'email
router.post('/login', limit.limiter, userCtrl.login);

module.exports = router;