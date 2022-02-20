const express = require('express');
const router = express.Router();

router.use('/create', require('./create'));
router.use('/search', require('./search'));
router.use('/edit', require('./edit'));
router.use('/delete', require('./delete'));
router.use('/delete-many', require('./delete-many'));
router.use('/status', require('./status'));
router.use('/last-online', require('./last-online'));

module.exports = router;
