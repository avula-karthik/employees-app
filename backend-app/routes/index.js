var express = require('express');
const path = require('path');
var router = express.Router();
var usersRouter = require('../routes/users');
var departmentRouter = require('../routes/department');
var employeesRouter = require('../routes/employee');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});
router.get('/uploads/:name', (req, res) => {
    const filePath = path.join(__dirname, '../', `/uploads/${req.params.name}`);
    res.status(200).sendFile(filePath);
});

router.use('/users', usersRouter);
router.use('/departments', departmentRouter);
router.use('/employees', employeesRouter);
module.exports = router;
