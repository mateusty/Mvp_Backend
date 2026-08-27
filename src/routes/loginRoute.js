const express = require('express');
const router = express.Router();
const userController = require('../controllers/loginController')

router.post('/', userController.doLogin);

module.exports = router;

