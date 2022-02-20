import express from 'express';
import login from './login';
import unauthorized from './unauthorized';

const router = express.Router();

router.use('/login', login);
router.use('/unauthorized', unauthorized);

export default router;
