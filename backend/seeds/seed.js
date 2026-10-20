const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { connectDB, disconnectDB } = require('../config/db');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const User = require('../models/User');

const categoriesData = require('../data/categoriesData');
const productsData = require('../data/productsData');
const couponsData = require('../data/couponsData');

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const seedDatabase = async (standalone = true) => {
  try {
    console.log('========================================================');
    console.log('ELECTROMART DATABASE SEEDER (College Demonstration Mode)');
    console.log('========================================================');
    if (standalone) {
      console.log('Connecting to database...');
      await connectDB();
    }

    // 1. Clear existing products, categories, coupons
    console.log('[1/4] Preparing catalog collections...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Coupon.deleteMany({});

    // 2. Insert Categories
    console.log(`[2/4] Seeding ${categoriesData.length} electronic categories...`);
    const createdCategories = await Category.insertMany(categoriesData);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    // 3. Prepare and Insert Products
    console.log(`[3/4] Seeding ${productsData.length} electronic products with Indian pricing (₹)...`);
    const preparedProducts = productsData.map((item) => {
      const categoryId = categoryMap[item.categorySlug];
      if (!categoryId) {
        throw new Error(`Category slug "${item.categorySlug}" not found in seeded categories.`);
      }

      const slug = generateSlug(item.name);
      return {
        ...item,
        category: categoryId,
        slug
      };
    });

    await Product.insertMany(preparedProducts);

    // 4. Insert Coupons
    console.log(`[4/4] Seeding ${couponsData.length} demonstration discount coupons...`);
    await Coupon.insertMany(couponsData);

    // 5. Seed or Update Default Admin & Demo Customer
    console.log('Configuring default demo accounts...');
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@electromart.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
    const adminSalt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash(adminPassword, adminSalt);

    await User.findOneAndUpdate(
      { email: adminEmail },
      {
        name: 'System Administrator',
        email: adminEmail,
        phone: '+91 9876543210',
        passwordHash: adminHash,
        role: 'admin',
        isActive: true
      },
      { upsert: true, new: true }
    );

    const customerEmail = 'customer@electromart.com';
    const customerPassword = 'Customer@12345';
    const customerSalt = await bcrypt.genSalt(10);
    const customerHash = await bcrypt.hash(customerPassword, customerSalt);

    await User.findOneAndUpdate(
      { email: customerEmail },
      {
        name: 'Rahul Sharma',
        email: customerEmail,
        phone: '+91 9123456780',
        passwordHash: customerHash,
        role: 'customer',
        isActive: true,
        addresses: [
          {
            fullName: 'Rahul Sharma',
            phone: '+91 9123456780',
            street: '42, Cyber Park, Electronic City Phase 1',
            city: 'Bengaluru',
            state: 'Karnataka',
            postalCode: '560100',
            country: 'India',
            isDefault: true
          }
        ]
      },
      { upsert: true, new: true }
    );

    console.log('========================================================');
    console.log('SUCCESS: ElectroMart database populated successfully!');
    console.log(`Total Categories: ${createdCategories.length}`);
    console.log(`Total Products:   ${preparedProducts.length}`);
    console.log(`Total Coupons:    ${couponsData.length}`);
    console.log('Demo Admin:       admin@electromart.com / Admin@12345');
    console.log('Demo Customer:    customer@electromart.com / Customer@12345');
    console.log('========================================================');

    if (standalone) {
      await disconnectDB();
      process.exit(0);
    }
  } catch (error) {
    console.error('ERROR during database seeding:', error);
    if (standalone) {
      await disconnectDB();
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
  seedDatabase(true);
}

module.exports = { seedDatabase };
