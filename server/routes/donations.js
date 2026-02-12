const express = require('express');
const Donation = require('../models/Donation');
const User = require('../models/User');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Create donation (Restaurants only)
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    if (req.user.role !== 'restaurant') {
      return res.status(403).json({ message: 'Only restaurants can create donations' });
    }

    const {
      foodType,
      quantity,
      description,
      pickupAddress,
      expiryTime,
      specialInstructions,
      priority,
      estimatedMeals
    } = req.body;

    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const donation = new Donation({
      restaurant: req.user.id,
      foodType,
      quantity,
      description,
      images,
      pickupLocation: {
        address: pickupAddress
      },
      expiryTime: new Date(expiryTime),
      specialInstructions,
      priority: priority || 'medium',
      estimatedMeals: estimatedMeals || 0
    });

    await donation.save();

    // Populate restaurant details
    await donation.populate('restaurant', 'name organizationName phone address');

    res.status(201).json({
      message: 'Donation created successfully',
      donation
    });
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({ message: 'Server error creating donation' });
  }
});

// Get available donations (NGOs and Volunteers)
router.get('/available', auth, async (req, res) => {
  try {
    if (!['ngo', 'volunteer', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { page = 1, limit = 10, foodType, priority, distance } = req.query;

    const query = {
      status: 'pending',
      expiryTime: { $gt: new Date() }
    };

    if (foodType && foodType !== 'all') {
      query.foodType = foodType;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    const donations = await Donation.find(query)
      .populate('restaurant', 'name organizationName phone address coordinates')
      .sort({ createdAt: -1, priority: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Donation.countDocuments(query);

    res.json({
      donations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get available donations error:', error);
    res.status(500).json({ message: 'Server error fetching donations' });
  }
});

// Get donations ready for pickup (accepted by NGO, not yet claimed by volunteer)
router.get('/ready-for-pickup', auth, async (req, res) => {
  try {
    if (!['volunteer', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { page = 1, limit = 10 } = req.query;
    const query = {
      status: 'accepted',
      volunteer: { $exists: false }
    };

    const donations = await Donation.find(query)
      .populate('restaurant', 'name organizationName phone address coordinates')
      .populate('acceptedBy', 'name organizationName phone address')
      .sort({ acceptedAt: -1, priority: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Donation.countDocuments(query);

    res.json({
      donations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get ready-for-pickup donations error:', error);
    res.status(500).json({ message: 'Server error fetching donations' });
  }
});

// Get user's donations
router.get('/my-donations', auth, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'restaurant') {
      query.restaurant = req.user.id;
    } else if (req.user.role === 'ngo') {
      query.acceptedBy = req.user.id;
    } else if (req.user.role === 'volunteer') {
      query.volunteer = req.user.id;
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    const donations = await Donation.find(query)
      .populate('restaurant', 'name organizationName phone address')
      .populate('acceptedBy', 'name organizationName phone address')
      .populate('volunteer', 'name phone')
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    console.error('Get my donations error:', error);
    res.status(500).json({ message: 'Server error fetching donations' });
  }
});

// Accept donation (NGOs only)
router.post('/:id/accept', auth, async (req, res) => {
  try {
    if (req.user.role !== 'ngo') {
      return res.status(403).json({ message: 'Only NGOs can accept donations' });
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.status !== 'pending') {
      return res.status(400).json({ message: 'Donation is not available' });
    }

    if (donation.expiryTime < new Date()) {
      donation.status = 'expired';
      await donation.save();
      return res.status(400).json({ message: 'Donation has expired' });
    }

    donation.status = 'accepted';
    donation.acceptedBy = req.user.id;
    donation.acceptedAt = new Date();

    await donation.save();

    await donation.populate('restaurant', 'name organizationName phone address');
    await donation.populate('acceptedBy', 'name organizationName phone address');

    res.json({
      message: 'Donation accepted successfully',
      donation
    });
  } catch (error) {
    console.error('Accept donation error:', error);
    res.status(500).json({ message: 'Server error accepting donation' });
  }
});

// Volunteer claim donation for pickup
router.post('/:id/claim', auth, async (req, res) => {
  try {
    if (req.user.role !== 'volunteer') {
      return res.status(403).json({ message: 'Only volunteers can claim donations' });
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.status !== 'accepted' || !donation.acceptedBy) {
      return res.status(400).json({ message: 'Donation is not ready for pickup' });
    }

    donation.volunteer = req.user.id;
    donation.status = 'picked_up';
    donation.pickedUpAt = new Date();

    await donation.save();

    res.json({ message: 'Donation claimed for pickup', donation });
  } catch (error) {
    console.error('Claim donation error:', error);
    res.status(500).json({ message: 'Server error claiming donation' });
  }
});

// Update donation status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Check permissions
    const canUpdate = 
      (req.user.role === 'restaurant' && donation.restaurant.equals(req.user.id)) ||
      (req.user.role === 'ngo' && donation.acceptedBy && donation.acceptedBy.equals(req.user.id)) ||
      (req.user.role === 'volunteer' && donation.volunteer && donation.volunteer.equals(req.user.id)) ||
      req.user.role === 'admin';

    if (!canUpdate) {
      return res.status(403).json({ message: 'Not authorized to update this donation' });
    }

    const validStatuses = ['pending', 'accepted', 'picked_up', 'delivered', 'expired', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    donation.status = status;

    if (status === 'picked_up') {
      donation.pickedUpAt = new Date();
    } else if (status === 'delivered') {
      donation.deliveredAt = new Date();
    }

    await donation.save();

    res.json({
      message: 'Donation status updated successfully',
      donation
    });
  } catch (error) {
    console.error('Update donation status error:', error);
    res.status(500).json({ message: 'Server error updating donation status' });
  }
});

// Get donation by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('restaurant', 'name organizationName phone address')
      .populate('acceptedBy', 'name organizationName phone address')
      .populate('volunteer', 'name phone');

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.json(donation);
  } catch (error) {
    console.error('Get donation error:', error);
    res.status(500).json({ message: 'Server error fetching donation' });
  }
});

module.exports = router;