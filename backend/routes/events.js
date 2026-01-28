const express = require('express');
const Event = require('../models/Event');
const User = require('../models/user');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Create event
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      eventType,
      location,
      eventDate,
      startTime,
      endTime,
      guestCount,
      budget,
      imageUrl,
    } = req.body;

    if (!title || !description || !location || !eventDate) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, location, and date are required',
      });
    }

    const event = await Event.create({
      title,
      description,
      eventType: eventType || 'Other',
      location,
      eventDate,
      startTime,
      endTime,
      guestCount,
      budget,
      imageUrl,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message,
    });
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const { status, eventType } = req.query;
    const where = {};

    if (status) where.status = status;
    if (eventType) where.eventType = eventType;

    const events = await Event.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email', 'profileImage'],
        },
      ],
      order: [['eventDate', 'ASC']],
    });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message,
    });
  }
});

// Get user's events
router.get('/user/my-events', authenticateToken, async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { userId: req.user.id },
      order: [['eventDate', 'ASC']],
    });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user events',
      error: error.message,
    });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email', 'profileImage'],
        },
      ],
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message,
    });
  }
});

// Update event
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (event.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

    const {
      title,
      description,
      eventType,
      location,
      eventDate,
      startTime,
      endTime,
      guestCount,
      budget,
      imageUrl,
      status,
    } = req.body;

    if (title) event.title = title;
    if (description) event.description = description;
    if (eventType) event.eventType = eventType;
    if (location) event.location = location;
    if (eventDate) event.eventDate = eventDate;
    if (startTime) event.startTime = startTime;
    if (endTime) event.endTime = endTime;
    if (guestCount) event.guestCount = guestCount;
    if (budget) event.budget = budget;
    if (imageUrl) event.imageUrl = imageUrl;
    if (status) event.status = status;

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message,
    });
  }
});

// Delete event
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (event.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event',
      });
    }

    await event.destroy();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message,
    });
  }
});

module.exports = router;
