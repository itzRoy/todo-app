const express = require('express');

const userController = require('./controller');

const router = express.Router();

router.post('/singup', userController.singup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

module.exports = router;