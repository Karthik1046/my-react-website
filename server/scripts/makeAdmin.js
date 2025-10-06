require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node scripts/makeAdmin.js <email>');
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set in config.env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  try {
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { role: 'admin' } },
      { new: true }
    ).select('-password');

    if (!user) {
      console.error(`User not found for email: ${email}`);
      process.exit(2);
    }

    console.log('Updated user to admin:', { id: user._id.toString(), email: user.email, role: user.role });
  } catch (e) {
    console.error('Error updating user:', e.message);
    process.exit(3);
  } finally {
    await mongoose.disconnect();
  }
}

main();


