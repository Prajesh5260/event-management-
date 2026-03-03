require('dotenv').config();
const sequelize = require('../config/database');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const args = process.argv.slice(2);
const parseArg = (key) => {
  const idx = args.indexOf(`--${key}`);
  if (idx === -1) return null;
  return args[idx + 1];
};

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    const email = parseArg('email') || 'events@polishedevents.com';
    const password = parseArg('password') || 'PolishedEvents123!';
    const firstName = parseArg('firstName') || 'Polished';
    const lastName = parseArg('lastName') || 'Events';

    let user = await User.findOne({ where: { email } });
    if (!user) {
      // Don't hash here - let the model's beforeCreate hook handle it
      user = await User.create({
        firstName,
        lastName,
        email,
        password,
        isAdmin: true,
        phone: null
      });
      console.log('Admin user created:', email);
    } else {
      // Don't hash here - let the model's beforeUpdate hook handle it
      user.password = password;
      user.isAdmin = true;
      await user.save();
      console.log('Admin user updated:', email);
    }

    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();