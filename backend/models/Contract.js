const mongoose = require('mongoose');

const contractSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'disputed'],
      default: 'active',
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'deposited'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;
