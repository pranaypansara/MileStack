const mongoose = require('mongoose');

const milestoneSchema = mongoose.Schema(
  {
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Contract',
    },
    title: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'approved', 'disputed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Milestone = mongoose.model('Milestone', milestoneSchema);

module.exports = Milestone;
