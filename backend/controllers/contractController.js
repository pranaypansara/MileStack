const Contract = require('../models/Contract');
const Milestone = require('../models/Milestone');

// @desc    Create a new contract
// @route   POST /api/contracts
// @access  Private (Client only logically, but simple validation)
const createContract = async (req, res) => {
  const { title, description, freelancerId, totalAmount } = req.body;

  try {
    const contract = new Contract({
      title,
      description,
      clientId: req.user._id,
      freelancerId,
      totalAmount,
      status: 'active',
      paymentStatus: 'pending', // Client will "deposit" later
    });

    const createdContract = await contract.save();
    res.status(201).json(createdContract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's contracts (either as client or freelancer)
// @route   GET /api/contracts
// @access  Private
const getContracts = async (req, res) => {
  try {
    // Find contracts where user is either the client or the freelancer
    const contracts = await Contract.find({
      $or: [{ clientId: req.user._id }, { freelancerId: req.user._id }],
    })
      .populate('clientId', 'name email')
      .populate('freelancerId', 'name email');

    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get contract by ID including milestones
// @route   GET /api/contracts/:id
// @access  Private
const getContractById = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('clientId', 'name email')
      .populate('freelancerId', 'name email');

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Verify user is part of the contract
    if (
      contract.clientId._id.toString() !== req.user._id.toString() &&
      contract.freelancerId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this contract' });
    }

    // Fetch milestones for this contract
    const milestones = await Milestone.find({ contractId: contract._id });

    res.json({ contract, milestones });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mock Escrow Deposit (Client pays into escrow)
// @route   PUT /api/contracts/:id/deposit
// @access  Private
const depositFunds = async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id);
        if (!contract) return res.status(404).json({ message: 'Contract not found' });
        
        if (contract.clientId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only clients can deposit funds' });
        }

        contract.paymentStatus = 'deposited';
        await contract.save();
        res.json({ message: 'Funds deposited successfully', contract });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createContract, getContracts, getContractById, depositFunds };
