require('dotenv').config();
const sequelize = require('./config/database');
const Event = require('./models/Event');
const User = require('./models/user');

const seedEvents = async () => {
  try {
    // Connect to database first
    await sequelize.authenticate();
    console.log('Database connected');

    // Check if events already exist
    const existingEvents = await Event.count();
    if (existingEvents > 0) {
      console.log('Events already exist. Skipping seed.');
      await sequelize.close();
      process.exit(0);
    }

    // Get or create an admin user for the events
    let user = await User.findOne({ where: { email: 'events@polishedevents.com' } });
    
    if (!user) {
      user = await User.create({
        firstName: 'Polished',
        lastName: 'Events',
        email: 'events@polishedevents.com',
        password: 'PolishedEvents123!', // In production, this should be hashed
        phone: '555-0000'
      });
      console.log('✓ Admin user created');
    }

    // Create sample events
    const events = [
      {
        title: 'Summer Wedding Celebration',
        eventType: 'Wedding',
        eventDate: new Date('2024-07-15'),
        location: 'Riverside Manor, New York',
        description: 'A beautiful summer wedding celebration with elegant decorations, gourmet catering, and live music entertainment.',
        budget: 15000,
        imageUrl: '/images/wedding-planning.jfif',
        userId: user.id
      },
      {
        title: 'Tech Conference 2024',
        eventType: 'Corporate',
        eventDate: new Date('2024-08-20'),
        location: 'Convention Center, San Francisco',
        description: 'Annual tech conference featuring keynote speakers, networking sessions, and hands-on workshops for industry professionals.',
        budget: 25000,
        imageUrl: null,
        userId: user.id
      },
      {
        title: 'Annual Gala Celebration',
        eventType: 'Anniversary',
        eventDate: new Date('2024-09-10'),
        location: 'Grand Ballroom, Boston',
        description: 'Exclusive anniversary gala event with dinner, live entertainment, and networking opportunities for corporate partners.',
        budget: 20000,
        imageUrl: null,
        userId: user.id
      },
      {
        title: 'Corporate Team Building',
        eventType: 'Corporate',
        eventDate: new Date('2024-08-05'),
        location: 'Adventure Park, Austin',
        description: 'Fun and engaging team building activities designed to strengthen company culture and employee relationships.',
        budget: 8000,
        imageUrl: null,
        userId: user.id
      },
      {
        title: 'Birthday Bash Extravaganza',
        eventType: 'Birthday',
        eventDate: new Date('2024-07-25'),
        location: 'Party Palace, Los Angeles',
        description: 'Spectacular birthday celebration with themed decorations, entertainment, games, and personalized catering.',
        budget: 5000,
        imageUrl: null,
        userId: user.id
      }
    ];

    // Create all events
    const createdEvents = await Event.bulkCreate(events);
    console.log(`✓ Successfully created ${createdEvents.length} sample events`);
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding events:', error);
    process.exit(1);
  }
};

seedEvents();
