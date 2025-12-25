import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gadget-store';

async function checkSetup() {
  console.log('🔍 Checking setup...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log(`  MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ Missing'}`);
  console.log(`  PORT: ${process.env.PORT || '3000 (default)'}`);
  console.log(`  JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '⚠️  Using default'}`);
  console.log('');

  // Check MongoDB connection
  console.log('🔌 MongoDB Connection:');
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('  ✅ Connected to MongoDB');
    
    // Check database content
    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();
    
    console.log(`  Products in database: ${productCount}`);
    console.log(`  Categories in database: ${categoryCount}`);
    
    if (productCount === 0) {
      console.log('\n  ⚠️  Database is empty! Run: npm run seed');
    } else {
      console.log('  ✅ Database has data');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.log(`  ❌ Failed to connect: ${error.message}`);
    console.log('\n  Troubleshooting:');
    console.log('    - Is MongoDB running?');
    console.log('    - Check MONGODB_URI in .env file');
    console.log('    - For local MongoDB: sudo systemctl start mongod (Linux)');
    console.log('    - For Atlas: Check connection string');
    process.exit(1);
  }

  console.log('\n✅ Setup check complete!');
  process.exit(0);
}

checkSetup();

