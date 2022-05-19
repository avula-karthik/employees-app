var express = require('express');
var router = express.Router();
var authenticationMiddleware = require('../middlewares/authentication');
var {
    getAllDepartments,
    addDepartment,
} = require('../controller/departmentcontroller');
router.get('/', authenticationMiddleware, getAllDepartments);
router.post('/', addDepartment);
module.exports = router;
