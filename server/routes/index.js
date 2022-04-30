const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/login', require('./login'));
router.use('/movies', require('./movies'))

module.exports = router;

