const express = require('express');
const router = express.Router();
const { createContract, getContracts, getContractById, depositFunds } = require('../controllers/contractController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createContract).get(protect, getContracts);
router.route('/:id').get(protect, getContractById);
router.route('/:id/deposit').put(protect, depositFunds);

module.exports = router;
