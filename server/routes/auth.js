const express = require('express')
const { body } = require('express-validator');
const User = require('../models/user');
const authController = require('../controllers/auth')
// const isAuth = require('../middleware/is-auth')

const router = express.Router();

router.post('/api/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        throw new Error('E-Mail address already exists!')
                        return Promise.reject('E-Mail address already exists!')
                    }
                })
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 8 }),
],
    authController.signup
)

router.post('/api/login', authController.login)

// router.post('/logout', authController.signout )

module.exports = router;