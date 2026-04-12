const Milestone = require('../models/Milestone');
const Contract = require('../models/Contract');

// @desc    Add a milestone to a contract
// @route   POST /api/milestones
// @access  Private
const createMilestone = async (req, res) => {
  const { contractId, title, amount } = req.body;

  try {
    const contract = await Contract.findById(contractId);
    if (!contract) return res.status(404).json({ message: 'Contract not found' });

    // Ensure only the client from the contract created the milestone
    if (contract.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the client can create milestones' });
    }

    const milestone = new Milestone({
      contractId,
      title,
      amount,
      status: 'pending',
    });

    const createdMilestone = await milestone.save();
    
    // Update contract totalAmount
    contract.totalAmount += Number(amount);
    await contract.save();

    res.status(201).json(createdMilestone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update milestone status
// @route   PUT /api/milestones/:id
// @access  Private
const updateMilestoneStatus = async (req, res) => {
  const { status } = req.body; 
  // status can be: 'pending' -> 'in-progress' -> 'completed' -> 'approved' / 'disputed'

  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

    const contract = await Contract.findById(milestone.contractId);

    if (contract.status !== 'active') {
      return res.status(400).json({ message: 'Cannot update milestone because the contract is not active' });
    }

    const isClient = contract.clientId.toString() === req.user._id.toString();
    const isFreelancer = contract.freelancerId.toString() === req.user._id.toString();

    if (!isClient && !isFreelancer) {
       return res.status(403).json({ message: 'Not authorized' });
    }

    // Role specific logic
    if (isFreelancer && (status === 'in-progress' || status === 'completed')) {
      milestone.status = status;
    } else if (isClient && (status === 'approved' || status === 'disputed')) {
      milestone.status = status;
    } else {
      return res.status(400).json({ message: 'Invalid status update for your role' });
    }

    await milestone.save();

    res.json(milestone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createMilestone, updateMilestoneStatus };
