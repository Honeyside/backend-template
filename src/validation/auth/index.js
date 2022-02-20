import express from 'express';
import login from './login';
import signUp from './sign-up';

const router = express.Router();

router.use('/login', login);
router.use('/sign-up', signUp);

export default router;
