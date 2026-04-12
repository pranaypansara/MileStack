const express = require('express');
const router = express.Router();
const { createContract, getContracts, getContractById, depositFunds, acceptContract, rejectContract } = require('../controllers/contractController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createContract).get(protect, getContracts);
router.route('/:id').get(protect, getContractById);
router.route('/:id/deposit').put(protect, depositFunds);
router.route('/:id/accept').post(protect, acceptContract);
router.route('/:id/reject').post(protect, rejectContract);

module.exports = router;
