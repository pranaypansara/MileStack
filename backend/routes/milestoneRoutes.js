const express = require('express');
const router = express.Router();
const { createMilestone, updateMilestoneStatus } = require('../controllers/milestoneController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createMilestone);
router.route('/:id').put(protect, updateMilestoneStatus);

module.exports = router;
