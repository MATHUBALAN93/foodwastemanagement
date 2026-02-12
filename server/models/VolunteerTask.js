const mongoose = require('mongoose');

const volunteerTaskSchema = new mongoose.Schema({
  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
    required: true
  },
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['assigned', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled'],
    default: 'assigned'
  },
  pickupTime: {
    type: Date,
    required: true
  },
  estimatedDeliveryTime: {
    type: Date
  },
  actualPickupTime: {
    type: Date
  },
  actualDeliveryTime: {
    type: Date
  },
  distance: {
    type: Number // in kilometers
  },
  estimatedDuration: {
    type: Number // in minutes
  },
  payment: {
    amount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending'
    }
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VolunteerTask', volunteerTaskSchema);