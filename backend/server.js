const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const couponRoutes = require('./routes/couponRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Security & Utility Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (e.g. mobile apps, curl, postman, same-origin)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      process.env.NODE_ENV !== 'production' ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.onrender.com') ||
      origin.endsWith('.netlify.app')
    ) {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS policy'));
  },
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply general API rate limiter
app.use('/api/', apiLimiter);

// Serve uploaded product images
app.use('/uploads', express.static(uploadsDir));

// Health Check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'ElectroMart E-Commerce API',
    currency: 'INR (₹)',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Serve frontend production build if available (supports single-service deploy)
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const { seedDatabase } = require('./seeds/seed');
const Category = require('./models/Category');

// Connect to MongoDB and listen
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is newly initialized and empty
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log('[ElectroMart] Empty database detected. Auto-seeding initial electronics catalog...');
      await seedDatabase(false);
    } else {
      // Auto-heal broken or outdated catalog images (AC and Refrigerator)
      try {
        const Product = require('./models/Product');
        await Category.updateOne(
          { slug: 'air-conditioners' },
          { $set: { image: 'https://images.unsplash.com/photo-1759772238012-9d5ad59ae637?w=600&auto=format&fit=crop&q=80' } }
        );
        await Category.updateOne(
          { slug: 'refrigerators' },
          { $set: { image: 'https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?w=600&auto=format&fit=crop&q=80' } }
        );
        await Product.updateOne(
          { name: { $regex: /LG 242L/i } },
          { $set: { images: ['https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?w=700&auto=format&fit=crop&q=80'] } }
        );
        await Product.updateOne(
          { name: { $regex: /Whirlpool 192L/i } },
          { $set: { images: ['https://images.unsplash.com/photo-1582466226723-5a8d62aa82d2?w=700&auto=format&fit=crop&q=80'] } }
        );
        await Product.updateOne(
          { name: { $regex: /Daikin 1.5/i } },
          { $set: { images: ['https://images.unsplash.com/photo-1759772238012-9d5ad59ae637?w=700&auto=format&fit=crop&q=80'] } }
        );
        await Product.updateOne(
          { name: { $regex: /Voltas 1.5/i } },
          { $set: { images: ['https://plus.unsplash.com/premium_photo-1679943423706-570c6462f9a4?w=700&auto=format&fit=crop&q=80'] } }
        );
        await Product.updateOne(
          { name: { $regex: /Panasonic 1 Ton/i } },
          { $set: { images: ['https://images.pexels.com/photos/17417642/pexels-photo-17417642.jpeg?auto=compress&cs=tinysrgb&w=800'] } }
        );
        console.log('[ElectroMart] Catalog images synchronized successfully.');
      } catch (syncErr) {
        console.warn('[ElectroMart] Image auto-sync warning:', syncErr.message);
      }
    }

    app.listen(PORT, () => {
      console.log('========================================================');
      console.log(`🚀 ElectroMart Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      console.log('========================================================');
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
