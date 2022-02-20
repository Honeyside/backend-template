import Express from 'express';

const router = Express.Router();
const passport = require('passport');

router.use(
  '/users',
  passport.authenticate(
    'jwt',
    { session: false, failureRedirect: '/api/auth/unauthorized' },
    null
  ),
  require('./users')
);

export default router;
