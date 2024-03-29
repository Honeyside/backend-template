import express from 'express';
import auth from './auth';
import updates from './updates';
import info from './info';

const router = express.Router();

router.use('/v1/auth', auth);
router.use('/updates', updates);
router.use('/info', info);

export default router;
