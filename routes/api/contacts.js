const { store, index } = require('../../controllers/api/contactController');

const router = require('express').Router();

router.post('/contacts',store);

module.exports = router;