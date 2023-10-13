const { index, show } = require('../controllers/contactController');

const router = require('express').Router();

router.get('/contacts',index);
router.get('/contacts/:id',show);

module.exports = router;