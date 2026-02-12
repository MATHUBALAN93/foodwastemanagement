const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodType: {
    type: String,
    required: true,
    enum: ['cooked_meals', 'fresh_vegetables', 'fruits', 'bread_pastries', 'dairy_products', 'other']
  },
  quantity: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  pickupLocation: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  expiryTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'picked_up', 'delivered', 'expired', 'cancelled'],
    default: 'pending'
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  acceptedAt: {
    type: Date
  },
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  pickedUpAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  estimatedMeals: {
    type: Number,
    default: 0
  },
  specialInstructions: {
    type: String
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Auto-expire donations
donationSchema.index({ expiryTime: 1 }, { expireAfterSeconds: 0 });

// Update status to expired when expiry time is reached
donationSchema.pre('save', function(next) {
  if (this.expiryTime < new Date() && this.status === 'pending') {
    this.status = 'expired';
  }
  next();
});

module.exports = mongoose.model('Donation', donationSchema);