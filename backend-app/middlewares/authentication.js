const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    const token = req.header('token');
    if (!token) {
        res.status(400).json({ msg: 'Please login/register' });
    }
    try {
        const hashRemovedToken = jwt.verify(token, 'employee_app_key');
        console.log(hashRemovedToken);
        next();
    } catch (error) {
        res.status(404).json({ msg: error });
    }
};
