const express = require('express');
const router = express.Router();
const passport = require('passport');

router.use('/users', passport.authenticate('jwt', {session: false, failureRedirect: '/api/auth/unauthorized'}, null), require('./users'));

module.exports = router;
