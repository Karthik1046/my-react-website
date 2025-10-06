require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function checkAndResetAdmin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not set in config.env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    const adminEmail = 'admin@movieflix.com';
    const newPassword = 'SecureAdmin2024!';

    // Find the admin user
    let adminUser = await User.findOne({ email: adminEmail });
    
    if (adminUser) {
      console.log('🔍 Found existing admin user:');
      console.log('- ID:', adminUser._id);
      console.log('- Name:', adminUser.name);
      console.log('- Email:', adminUser.email);
      console.log('- Role:', adminUser.role);
      console.log('- Created:', adminUser.createdAt);
      
      // Delete the existing admin user
      await User.deleteOne({ email: adminEmail });
      console.log('🗑️ Deleted existing admin user');
    }

    // Create a fresh admin user
    console.log('🔄 Creating fresh admin user...');
    
    const freshAdminUser = new User({
      name: 'Admin User',
      email: adminEmail,
      password: newPassword,
      role: 'admin'
    });
    
    await freshAdminUser.save();
    console.log('✅ Fresh admin user created successfully!');

    // Verify the user was created correctly
    const verifyUser = await User.findOne({ email: adminEmail });
    if (verifyUser) {
      console.log('🔍 Verification - Admin user details:');
      console.log('- ID:', verifyUser._id);
      console.log('- Name:', verifyUser.name);
      console.log('- Email:', verifyUser.email);
      console.log('- Role:', verifyUser.role);
      
      // Test password verification
      const isPasswordValid = await verifyUser.comparePassword(newPassword);
      console.log('- Password verification:', isPasswordValid ? '✅ Valid' : '❌ Invalid');
    }

    console.log('\n📋 ADMIN LOGIN CREDENTIALS:');
    console.log('================================');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${newPassword}`);
    console.log(`👑 Role: admin`);
    console.log('================================\n');

    console.log('🌐 LOGIN INSTRUCTIONS:');
    console.log('1. Make sure both frontend and backend are running');
    console.log('2. Go to: http://localhost:3000');
    console.log('3. Click "Login"');
    console.log(`4. Enter email: ${adminEmail}`);
    console.log(`5. Enter password: ${newPassword}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Database connection closed');
  }
}

checkAndResetAdmin();