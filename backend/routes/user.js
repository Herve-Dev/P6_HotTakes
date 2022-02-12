const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const passValidator = require('../middleware/password-validator');
const emailControl = require('../middleware/email-validator');

router.post('/signup',passValidator, emailControl, userCtrl.signup); // ajout de module de protection comme password validator et validator pour l'email
router.post('/login', userCtrl.login);

module.exports = router;