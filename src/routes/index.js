import express from 'express';
import config from '../../config';
import auth from './auth';
import updates from './updates';
import info from './info';

const router = express.Router();
const prefix = config.prefix ? `/${config.prefix}` : '';

// TODO add admin, files sections

// router.use(`${prefix}/admin`, require('./admin'));

router.use(`${prefix}/auth`, auth);

// router.use(`${prefix}/files`, require('./files'));

router.use('/updates', updates);

router.use('/info', info);

export default router;
