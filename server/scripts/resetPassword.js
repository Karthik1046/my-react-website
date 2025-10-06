require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function main() {
  const email = process.argv[2];
  const newPassword = process.argv[3];
  
  if (!email || !newPassword) {
    console.error('Usage: node scripts/resetPassword.js <email> <newPassword>');
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set in config.env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  try {
    // Hash the new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { password: hashedPassword } },
      { new: true }
    ).select('-password');

    if (!user) {
      console.error(`User not found for email: ${email}`);
      process.exit(2);
    }

    console.log('Password updated successfully for:', { 
      id: user._id.toString(), 
      email: user.email, 
      name: user.name 
    });
  } catch (e) {
    console.error('Error updating password:', e.message);
    process.exit(3);
  } finally {
    await mongoose.disconnect();
  }
}

main();
