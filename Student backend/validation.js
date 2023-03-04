const { check } = require('express-validator');

var email;
exports.signupValidator = [
    check('name', 'Name is required length minimum 2 characters').not().isEmpty(),
    check('email', 'Please enter valid email').isEmail().normalizeEmail(),
    check('password', 'password must include at least 6 characters').isLength({min : 6})
]

// module.exports = signupValidator