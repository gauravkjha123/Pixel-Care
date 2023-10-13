const { index } = require('../controllers/dashboardController');

const router = require('express').Router();

router.get('/dashboard',index);

module.exports = router;