require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not set in config.env');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    const users = await User.find().select('email name role createdAt lastLoginAt').sort({ createdAt: -1 });
    console.log('Total users:', users.length);
    users.forEach(u => {
      console.log(`${u._id} | ${u.email} | ${u.name} | role=${u.role} | joined=${u.createdAt?.toISOString?.() || ''} | lastLogin=${u.lastLoginAt?.toISOString?.() || ''}`);
    });
    await mongoose.disconnect();
  } catch (e) {
    console.error('Error listing users:', e.message);
    process.exit(2);
  }
})();


