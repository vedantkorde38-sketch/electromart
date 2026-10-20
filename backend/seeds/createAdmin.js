const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    const email = (process.argv[2] || process.env.ADMIN_EMAIL || 'admin@electromart.com').toLowerCase().trim();
    const password = process.argv[3] || process.env.ADMIN_PASSWORD || 'Admin@12345';
    const name = process.argv[4] || 'System Administrator';

    if (password.length < 6) {
      console.error('Password must be at least 6 characters');
      process.exit(1);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const adminUser = await User.findOneAndUpdate(
      { email },
      {
        name,
        email,
        passwordHash,
        role: 'admin',
        isActive: true
      },
      { upsert: true, new: true }
    );

    console.log('========================================================');
    console.log('SUCCESS: Administrator account configured successfully!');
    console.log(`Name:  ${adminUser.name}`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`Role:  ${adminUser.role}`);
    console.log('========================================================');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin account:', error.message);
    await disconnectDB();
    process.exit(1);
  }
};

createAdmin();
