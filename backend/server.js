require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const User = require('./models/user');
const Event = require('./models/Event');
const Service = require('./models/Service');
const Booking = require('./models/Booking');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Associations
User.hasMany(Event, { foreignKey: 'userId', onDelete: 'CASCADE' });
Event.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Booking, { foreignKey: 'userId', onDelete: 'CASCADE' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Event.hasMany(Booking, { foreignKey: 'eventId', onDelete: 'CASCADE' });
Booking.belongsTo(Event, { foreignKey: 'eventId' });

Service.hasMany(Booking, { foreignKey: 'serviceId', onDelete: 'CASCADE' });
Booking.belongsTo(Service, { foreignKey: 'serviceId' });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
  });
});

// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error Handler
app.use(errorHandler);

// Database sync and server start
sequelize
  .authenticate()
  .then(() => {
    console.log('✓ Database connected successfully');
    return sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
  })
  .then(() => {
    console.log('✓ Database models synced');
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log('✓ API Documentation:');
      console.log(`  - Auth: POST ${PORT}/api/auth/register, POST ${PORT}/api/auth/login`);
      console.log(`  - Users: GET ${PORT}/api/users/profile, PUT ${PORT}/api/users/profile`);
      console.log(`  - Events: GET/POST ${PORT}/api/events, GET/PUT/DELETE ${PORT}/api/events/:id`);
      console.log(`  - Services: GET/POST ${PORT}/api/services, GET ${PORT}/api/services/:id`);
    });
  })
  .catch((error) => {
    console.error('✗ Database connection error:', error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;
