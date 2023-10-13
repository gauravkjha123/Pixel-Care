const { edit, update } = require('../../controllers/api/userController');

const router = require('express').Router();

router.get('/profile',edit);
router.put('/profile-update',update);
module.exports = router;