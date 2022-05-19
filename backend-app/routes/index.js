var express = require('express');
const path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});
router.get('/uploads/:name', (req, res) => {
    const filePath = path.join(__dirname, '../', `/uploads/${req.params.name}`);
    res.status(200).sendFile(filePath);
});
module.exports = router;
