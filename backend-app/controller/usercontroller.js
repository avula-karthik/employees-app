const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models').User;

// get email and password from the client/users.
// if same email already exists send 409 conflict status code.
// if no such user then encrypt the password and create new user and set status code to 200
createUser = async (req, res) => {
    let { email, password } = req.body;
    let encryptedPassword;
    try {
        let salt = bcrypt.genSaltSync(10);
        encryptedPassword = bcrypt.hashSync(password, salt);
    } catch (error) {
        console.log(error);
    }
    const checkUser = await User.findOne({ where: { email } }).catch((err) => {
        console.log(err);
    });
    if (checkUser) {
        res.status(409).json({ message: 'User with email exists' });
    } else {
        const newUser = new User({ email, password: encryptedPassword });
        await newUser.save().then(res.status(200).json({ msg: 'user added' }));
    }
};

//get email and password from users.
//check if there are any user with such email.
//if there is no such users display 400 bad request code.
//if there is compare the password with encrypted password
//if compare is success then sigh token with secret key provided and generate token with some expiry
loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        let anyUserWithSameMail = await User.findOne({ where: { email } });
        if (anyUserWithSameMail) {
            const passCorrect = bcrypt.compareSync(
                password,
                anyUserWithSameMail.password
            );
            if (!passCorrect) {
                return res.status(400).json({
                    status: 0,
                    debug_data: 'Wrong credentials - in comparesync',
                });
            } else {
                const payload = {
                    user: {
                        email,
                    },
                };
                const token = jwt.sign(payload, 'employee_app_key', {
                    expiresIn: 8000,
                });
                res.status(200).json({ token, User });
            }
        } else {
            return res.status(400).json({ error: 'no such email exists' });
        }
    } catch (error) {
        res.status(500).json({ msg: 'Error' + error });
    }
};
module.exports = { createUser, loginUser };
