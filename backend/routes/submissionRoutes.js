const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// User Routes
router.post('/', verifyToken, upload.single('file'), submissionController.createSubmission);
router.get('/my', verifyToken, submissionController.getMySubmissions);

// Admin Routes
router.get('/all', verifyToken, isAdmin, submissionController.getAllSubmissions);

module.exports = router;
