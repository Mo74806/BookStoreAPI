// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
  {
    items: {
      type: [mongoose.Schema.ObjectId],
      ref: 'Book',
      required: [true, 'purchase must belong to a Book.'],
    },
    buyer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'purchase must belong to a user'],
    },
    delivery: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'purchase must belong to a user'],
    },
    status: {
      type: String,
      default: 'pending',
    },
    handOffline: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
