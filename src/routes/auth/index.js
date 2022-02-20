import express from 'express';
import login from './login';
import signUp from './sign-up';
import unauthorized from './unauthorized';

const router = express.Router();

router.use('/login', login);
router.use('/sign-up', signUp);
router.use('/unauthorized', unauthorized);

export default router;
