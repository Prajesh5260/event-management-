const express = require('express');
const Booking = require('../models/Booking');
const User = require('../models/user');
const Event = require('../models/Event');
const Service = require('../models/Service');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Create booking (Protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { eventId, serviceId, bookingType, quantity, preferredDate, notes, totalPrice } = req.body;

    if (!bookingType) {
      return res.status(400).json({
        success: false,
        message: 'Booking type is required',
      });
    }

    if (bookingType === 'Event' && !eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required for event booking',
      });
    }

    if (bookingType === 'Service' && !serviceId) {
      return res.status(400).json({
        success: false,
        message: 'Service ID is required for service booking',
      });
    }

    const booking = await Booking.create({
      userId: req.user.id,
      eventId: bookingType === 'Event' ? eventId : null,
      serviceId: bookingType === 'Service' ? serviceId : null,
      bookingType,
      quantity: quantity || 1,
      preferredDate,
      notes,
      totalPrice,
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message,
    });
  }
});

// Get all bookings (admin)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: Event,
          attributes: ['id', 'title', 'location', 'eventDate'],
        },
        {
          model: Service,
          attributes: ['id', 'name', 'category', 'price'],
        },
      ],
      order: [['bookingDate', 'DESC']],
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message,
    });
  }
});

// Get user's bookings (Protected)
router.get('/user/my-bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Event,
          attributes: ['id', 'title', 'location', 'eventDate', 'description'],
        },
        {
          model: Service,
          attributes: ['id', 'name', 'category', 'price', 'description'],
        },
      ],
      order: [['bookingDate', 'DESC']],
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user bookings',
      error: error.message,
    });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: Event,
          attributes: ['id', 'title', 'location', 'eventDate'],
        },
        {
          model: Service,
          attributes: ['id', 'name', 'category', 'price'],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message,
    });
  }
});

// Update booking (Protected)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking',
      });
    }

    const { quantity, preferredDate, notes, status, totalPrice } = req.body;

    if (quantity) booking.quantity = quantity;
    if (preferredDate) booking.preferredDate = preferredDate;
    if (notes) booking.notes = notes;
    if (status) booking.status = status;
    if (totalPrice) booking.totalPrice = totalPrice;

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating booking',
      error: error.message,
    });
  }
});

// Cancel booking (Protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message,
    });
  }
});

module.exports = router;
