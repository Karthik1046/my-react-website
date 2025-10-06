require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

async function createAdminUser() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not set in config.env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // Admin user credentials
    const adminData = {
      name: 'Admin User',
      email: 'admin@movieflix.com',
      password: 'SecureAdmin2024!',
      role: 'admin'
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('🔄 Admin user already exists, updating role...');
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('✅ Admin role updated for existing user');
    } else {
      // Create new admin user
      const adminUser = new User(adminData);
      await adminUser.save();
      console.log('🎉 Admin user created successfully!');
    }

    console.log('\n📋 ADMIN USER CREDENTIALS:');
    console.log('==========================');
    console.log(`📧 Email: ${adminData.email}`);
    console.log(`🔑 Password: ${adminData.password}`);
    console.log(`👑 Role: admin`);
    console.log('==========================\n');

    console.log('🌐 HOW TO ACCESS ADMIN PANEL:');
    console.log('1. Go to: http://localhost:3000');
    console.log('2. Click "Login" in the header');
    console.log(`3. Enter email: ${adminData.email}`);
    console.log(`4. Enter password: ${adminData.password}`);
    console.log('5. After login, click "Admin" in the header');
    console.log('6. Or directly go to: http://localhost:3000/admin');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    if (error.code === 11000) {
      console.log('📧 User with this email already exists');
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Database connection closed');
  }
}

createAdminUser();