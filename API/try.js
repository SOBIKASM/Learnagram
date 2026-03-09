require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

async function resetPasswords() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/learnagram');
  console.log('✅ Connected to MongoDB');

  const hash = await bcrypt.hash('pass123', 10);

  const result = await User.updateMany({}, { $set: { password: hash } });
  console.log(`✅ Reset passwords for ${result.modifiedCount} users`);
  console.log('🔑 All users can now login with: pass123');

  await mongoose.disconnect();
  console.log('✅ Done');
}

resetPasswords().catch(console.error);