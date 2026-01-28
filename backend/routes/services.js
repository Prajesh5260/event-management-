const express = require('express');
const Service = require('../models/Service');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Create service (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, category, price, imageUrl } = req.body;

    if (!name || !description || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, category, and price are required',
      });
    }

    const service = await Service.create({
      name,
      description,
      category,
      price,
      imageUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message,
    });
  }
});

// Get all services
router.get('/', async (req, res) => {
  try {
    const { category, sortBy } = req.query;
    const where = { isActive: true };

    if (category) where.category = category;

    let order = [['name', 'ASC']];
    if (sortBy === 'price-low') order = [['price', 'ASC']];
    if (sortBy === 'price-high') order = [['price', 'DESC']];
    if (sortBy === 'rating') order = [['rating', 'DESC']];

    const services = await Service.findAll({
      where,
      order,
    });

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message,
    });
  }
});

// Get service categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = [
      'Catering',
      'Decoration',
      'Photography',
      'Music',
      'Venue',
      'Planning',
    ];

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message,
    });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: error.message,
    });
  }
});

// Update service
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    const { name, description, category, price, imageUrl, rating, reviews, isActive } =
      req.body;

    if (name) service.name = name;
    if (description) service.description = description;
    if (category) service.category = category;
    if (price) service.price = price;
    if (imageUrl) service.imageUrl = imageUrl;
    if (rating !== undefined) service.rating = rating;
    if (reviews !== undefined) service.reviews = reviews;
    if (isActive !== undefined) service.isActive = isActive;

    await service.save();

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating service',
      error: error.message,
    });
  }
});

// Delete service
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    await service.destroy();

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
      error: error.message,
    });
  }
});

module.exports = router;
