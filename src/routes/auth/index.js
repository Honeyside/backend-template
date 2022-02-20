import express from 'express';
import login from './login';
import unauthorized from './unauthorized';

const router = express.Router();

// TODO add missing routes
router.use('/login', login);

// router.use('/sign-up', require('./sign-up'));

// router.use('/code', require('./code'));

// router.use('/reset-password', require('./reset-password'));

// router.use('/user', passport.authenticate('jwt', {
//   session: false, failureRedirect: '/api/auth/unauthorized',
// }, null), require('./user'));

// router.use('/update-profile', passport.authenticate('jwt', {
//   session: false, failureRedirect: '/api/auth/unauthorized',
// }, null), require('./update-profile'));

// router.use('/change-password', passport.authenticate('jwt', {
//   session: false, failureRedirect: '/api/auth/unauthorized',
// }, null), require('./change-password'));

router.use('/unauthorized', unauthorized);

// router.use('/change-picture', passport.authenticate('jwt', {
//   session: false, failureRedirect: '/api/auth/unauthorized',
// }, null), require('./change-picture'));

export default router;
