const express = require('express');
const { Op } = require('sequelize');
const User = require('../models/user');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const Service = require('../models/Service');
const authenticateToken = require('../middleware/auth');
const adminOnly = require('../middleware/admin');

const router = express.Router();

// All admin routes require authentication + admin role
router.use(authenticateToken);
router.use(adminOnly);

// Get all users (basic info)
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'isActive', 'isAdmin', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
  }
});

// Get single user with bookings
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Booking,
          include: [
            { model: Event },
            { model: Service },
          ],
        },
      ],
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user', error: error.message });
  }
});

// Update user (e.g., toggle isAdmin, isActive)
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { isAdmin, isActive, firstName, lastName, phone } = req.body;
    if (typeof isAdmin !== 'undefined') user.isAdmin = !!isAdmin;
    if (typeof isActive !== 'undefined') user.isActive = !!isActive;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;

    await user.save();
    res.status(200).json({ success: true, message: 'User updated', user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user', error: error.message });
  }
});

// Get all bookings with related user/event/service
router.get('/bookings', async (req, res) => {
  try {
    const where = {};
    if (req.query.status) where.status = req.query.status;

    const bookings = await Booking.findAll({
      where,
      include: [
        { model: User, attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Event, attributes: ['id', 'title', 'eventDate'] },
        { model: Service, attributes: ['id', 'serviceName'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching bookings', error: error.message });
  }
});

// (Optional) Update booking status
router.put('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const { status } = req.body;
    if (status) booking.status = status;

    await booking.save();
    res.status(200).json({ success: true, message: 'Booking updated', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating booking', error: error.message });
  }
});

module.exports = router;
