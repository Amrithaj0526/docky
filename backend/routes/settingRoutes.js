const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/deadline', settingController.getDeadline);
router.post('/deadline', verifyToken, isAdmin, settingController.updateDeadline);

module.exports = router;
