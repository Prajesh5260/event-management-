require('dotenv').config();
const sequelize = require('../config/database');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const argv = require('yargs')
  .option('email', { type: 'string', demandOption: true })
  .option('password', { type: 'string', demandOption: true })
  .option('firstName', { type: 'string', default: 'Admin' })
  .option('lastName', { type: 'string', default: 'User' })
  .argv;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    const { email, password, firstName, lastName } = argv;

    let user = await User.findOne({ where: { email } });
    if (!user) {
      const hashed = await bcrypt.hash(password, 10);
      user = await User.create({
        firstName,
        lastName,
        email,
        password: hashed,
        isAdmin: true,
        phone: null
      });
      console.log('Admin user created:', email);
    } else {
      user.password = await bcrypt.hash(password, 10);
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