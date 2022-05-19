var express = require('express');
var router = express.Router();
var { createUser, loginUser } = require('../controller/usercontroller');

router.post('/register', createUser);
router.post('/login', loginUser);

module.exports = router;
