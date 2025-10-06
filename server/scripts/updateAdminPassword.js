require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function updateAdminPassword() {
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
    const adminUser = await User.findOne({ email: adminEmail });
    
    if (!adminUser) {
      console.log('❌ Admin user not found. Creating new admin user...');
      
      // Create new admin user
      const newAdminUser = new User({
        name: 'Admin User',
        email: adminEmail,
        password: newPassword,
        role: 'admin'
      });
      
      await newAdminUser.save();
      console.log('🎉 New admin user created successfully!');
    } else {
      console.log('🔄 Admin user found, updating password...');
      
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // Update password and ensure admin role
      adminUser.password = hashedPassword;
      adminUser.role = 'admin';
      await adminUser.save();
      
      console.log('✅ Admin password updated successfully!');
    }

    console.log('\n📋 UPDATED ADMIN USER CREDENTIALS:');
    console.log('=======================================');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${newPassword}`);
    console.log(`👑 Role: admin`);
    console.log('=======================================\n');

    console.log('🌐 HOW TO ACCESS ADMIN PANEL:');
    console.log('1. Go to: http://localhost:3000');
    console.log('2. Click "Login" in the header');
    console.log(`3. Enter email: ${adminEmail}`);
    console.log(`4. Enter password: ${newPassword}`);
    console.log('5. After login, click "Admin" in the header');
    console.log('6. Or directly go to: http://localhost:3000/admin');
    
  } catch (error) {
    console.error('❌ Error updating admin password:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Database connection closed');
  }
}

updateAdminPassword();