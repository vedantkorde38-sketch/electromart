/**
 * ElectroMart Automated API Test Suite
 * Comprehensive End-to-End API verification for College Mini Project
 */

const assert = require('assert');
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');
const app = require('../server');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { seedDatabase } = require('../seeds/seed');

const TEST_PORT = 5055;
const BASE_URL = `http://localhost:${TEST_PORT}/api`;

let server;
let adminToken = '';
let customerToken = '';
let newUserId = '';
let testProductId = '';
let initialStock = 0;
let testOrderId = '';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

async function runTest(testName, testFn) {
  totalTests++;
  try {
    process.stdout.write(`  [TEST ${totalTests}] ${testName} ... `);
    await testFn();
    passedTests++;
    console.log('✅ PASS');
  } catch (err) {
    failedTests++;
    console.log('❌ FAIL');
    console.error(`      Error: ${err.message}`);
  }
}

async function startSuite() {
  console.log('\n========================================================');
  console.log('⚡ ElectroMart Automated API Test Suite Initializing');
  console.log('========================================================\n');

  await connectDB();

  // Ensure data exists
  const productCount = await Product.countDocuments();
  if (productCount < 10) {
    console.log('Seeding initial dataset for test execution...');
    await seedDatabase(false);
  }

  // Start test HTTP server
  await new Promise((resolve) => {
    server = app.listen(TEST_PORT, () => {
      console.log(`Test server running on port ${TEST_PORT}\n`);
      resolve();
    });
  });

  // TEST 1: Health check
  await runTest('GET /api/health should return status OK and INR currency', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'OK');
    assert.strictEqual(data.currency, 'INR (₹)');
  });

  // TEST 2: Categories API
  await runTest('GET /api/categories should return all 12 electronic categories', async () => {
    const res = await fetch(`${BASE_URL}/categories`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(Array.isArray(data.categories), 'data.categories should be an array');
    assert(data.categories.length >= 10, `Expected at least 10 categories, got ${data.categories.length}`);
    const slugs = data.categories.map(c => c.slug);
    assert(slugs.includes('smartphones'), 'Must include smartphones');
    assert(slugs.includes('laptops-and-computers'), 'Must include laptops');
  });

  // TEST 3: Products API - Pagination & Filtering
  await runTest('GET /api/products should return paginated electronics products', async () => {
    const res = await fetch(`${BASE_URL}/products?page=1&limit=8`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(Array.isArray(data.products), 'Should have products array');
    assert.strictEqual(data.page, 1);
    assert(data.total >= 30, `Expected >= 30 products, got ${data.total}`);
    
    // Pick first product for subsequent tests
    const prod = data.products[0];
    testProductId = prod._id;
    initialStock = prod.stock;
    assert(prod.price > 0, 'Price must be positive INR value');
  });

  // TEST 4: Products Search
  await runTest('GET /api/products?keyword=Sony should return Sony products', async () => {
    const res = await fetch(`${BASE_URL}/products?keyword=Sony`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.products.length > 0, 'Should find at least one Sony product');
    const hasSony = data.products.some(p => p.brand.toLowerCase().includes('sony') || p.name.toLowerCase().includes('sony'));
    assert(hasSony, 'Returned products must match search term Sony');
  });

  // TEST 5: Products Category Filter
  await runTest('GET /api/products?category=smartphones should filter by smartphone category', async () => {
    const res = await fetch(`${BASE_URL}/products?category=smartphones`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.products.length > 0, 'Should return smartphones');
  });

  // TEST 6: Single Product Details
  await runTest('GET /api/products/:id should return complete product with specifications', async () => {
    const res = await fetch(`${BASE_URL}/products/${testProductId}`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.product._id, testProductId);
    assert(data.product.specifications, 'Product must have specifications object');
    assert(data.product.price > 0, 'Product must have price');
  });

  // TEST 7: Customer Registration
  const randomEmail = `testuser_${Date.now()}@example.com`;
  await runTest('POST /api/auth/register should create a new customer account', async () => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rahul Sharma',
        email: randomEmail,
        password: 'Password@123',
        phone: '9876543210'
      })
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert(data.token, 'Response must include JWT token');
    customerToken = data.token;
    newUserId = data.user._id;
    assert.strictEqual(data.user.role, 'customer');
    assert.strictEqual(data.user.email, randomEmail);
  });

  // TEST 8: Duplicate Registration prevention
  await runTest('POST /api/auth/register with existing email should return 400 error', async () => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rahul Sharma Duplicate',
        email: randomEmail,
        password: 'Password@123'
      })
    });
    assert.strictEqual(res.status, 400);
  });

  // TEST 9: Customer Login
  await runTest('POST /api/auth/login should authenticate registered customer', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: randomEmail,
        password: 'Password@123'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.token, 'Login must return token');
    customerToken = data.token;
    assert.strictEqual(data.user.email, randomEmail);
  });

  // TEST 10: Protected Profile Endpoint
  await runTest('GET /api/auth/me with Bearer token should return user profile', async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.user._id, newUserId);
    assert.strictEqual(data.user.name, 'Rahul Sharma');
    assert(!data.user.passwordHash, 'Password hash must never be returned');
  });

  // TEST 11: Wishlist Operations
  await runTest('POST /api/wishlist/:id and GET /api/wishlist should manage saved items', async () => {
    const addRes = await fetch(`${BASE_URL}/wishlist/${testProductId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert(addRes.status === 200 || addRes.status === 201);

    const getRes = await fetch(`${BASE_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert.strictEqual(getRes.status, 200);
    const data = await getRes.json();
    assert(Array.isArray(data.wishlist), 'Wishlist must be an array');
    const found = data.wishlist.some(p => p._id.toString() === testProductId.toString());
    assert(found, 'Added product must exist in wishlist');
  });

  // TEST 12: Cart Operations
  await runTest('POST /api/cart/items and GET /api/cart should store cart items for user', async () => {
    const addRes = await fetch(`${BASE_URL}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({ productId: testProductId, quantity: 2 })
    });
    assert.strictEqual(addRes.status, 200);

    const getRes = await fetch(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert.strictEqual(getRes.status, 200);
    const cart = await getRes.json();
    assert(cart.items.length > 0, 'Cart must have items');
    const item = cart.items.find(i => (i.product._id || i.product).toString() === testProductId.toString());
    assert(item, 'Added product must be in cart');
    assert.strictEqual(item.quantity, 2);
  });

  // TEST 13: Coupon Validation (Valid)
  await runTest('POST /api/coupons/validate with WELCOME10 should return 10% discount', async () => {
    const res = await fetch(`${BASE_URL}/coupons/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({ code: 'WELCOME10', cartTotal: 10000 })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.coupon.discountAmount, 1000);
  });

  // TEST 14: Coupon Validation (Invalid)
  await runTest('POST /api/coupons/validate with invalid code should return error', async () => {
    const res = await fetch(`${BASE_URL}/coupons/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({ code: 'BOGUS99', cartTotal: 5000 })
    });
    assert.strictEqual(res.status, 400);
  });

  // TEST 15: Checkout & Atomic Stock Decrement
  await runTest('POST /api/orders should create order and safely decrement product stock', async () => {
    const beforeProd = await Product.findById(testProductId);
    const beforeStock = beforeProd.stock;

    const orderPayload = {
      items: [
        {
          productId: testProductId,
          quantity: 1
        }
      ],
      shippingAddress: {
        fullName: 'Rahul Sharma',
        phone: '9876543210',
        street: 'Flat 402, Green Avenue, MG Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560001',
        country: 'India'
      },
      paymentMethod: 'COD',
      couponCode: 'WELCOME10'
    };

    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify(orderPayload)
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert(data.order._id, 'Order must have an ID');
    assert(data.order.orderNumber, 'Order must have a unique orderNumber');
    assert(data.order.orderStatus === 'Pending' || data.order.orderStatus === 'Confirmed');
    testOrderId = data.order._id;

    // Verify product stock was decremented in database
    const afterProd = await Product.findById(testProductId);
    assert.strictEqual(afterProd.stock, beforeStock - 1, 'Product stock should be exactly 1 less');
  });

  // TEST 16: Customer Order History
  await runTest('GET /api/orders/my-orders should list orders for logged in user', async () => {
    const res = await fetch(`${BASE_URL}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(Array.isArray(data.orders), 'Orders should be array');
    const found = data.orders.some(o => o._id === testOrderId);
    assert(found, 'Placed order must exist in customer orders');
  });

  // TEST 17: Admin Login
  await runTest('POST /api/auth/login with admin credentials should return admin token', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@electromart.com',
        password: 'Admin@12345'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.user.role, 'admin');
    assert(data.token, 'Admin must receive token');
    adminToken = data.token;
  });

  // TEST 18: Admin Order Status Management (Update active order to Processing)
  await runTest('PATCH /api/admin/orders/:id/status should update delivery status', async () => {
    const res = await fetch(`${BASE_URL}/admin/orders/${testOrderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'Processing' })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.order.orderStatus, 'Processing');
  });

  // TEST 19: Order Cancellation & Stock Restoration
  // (Cancel order while in Confirmed / Processing)
  // Let's create a temporary order specifically for cancellation to test stock restore
  await runTest('PATCH /api/orders/:id/cancel should cancel order and restore product stock', async () => {
    // 1. Create cancel-test order
    const beforeProd = await Product.findById(testProductId);
    const stockBeforeOrder = beforeProd.stock;

    const orderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        items: [{ productId: testProductId, quantity: 1 }],
        shippingAddress: {
          fullName: 'Rahul Sharma',
          phone: '9876543210',
          street: 'Flat 402, Green Avenue, MG Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India'
        },
        paymentMethod: 'COD'
      })
    });
    assert.strictEqual(orderRes.status, 201);
    const orderData = await orderRes.json();
    const cancelOrderId = orderData.order._id;

    const prodAfterOrder = await Product.findById(testProductId);
    assert.strictEqual(prodAfterOrder.stock, stockBeforeOrder - 1);

    // 2. Cancel order
    const cancelRes = await fetch(`${BASE_URL}/orders/${cancelOrderId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({ reason: 'Ordered by mistake' })
    });

    assert.strictEqual(cancelRes.status, 200);
    const data = await cancelRes.json();
    assert.strictEqual(data.order.orderStatus, 'Cancelled');

    // 3. Verify stock is restored back
    const restoredProd = await Product.findById(testProductId);
    assert.strictEqual(restoredProd.stock, stockBeforeOrder, 'Stock must be restored back to original');
  });

  // TEST 20: Product Review & Auto Star Recalculation
  await runTest('POST /api/reviews/products/:id/reviews should submit review and recalculate rating', async () => {
    const res = await fetch(`${BASE_URL}/reviews/products/${testProductId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        rating: 5,
        title: 'Outstanding Electronics Quality',
        comment: 'Super fast delivery and pristine original manufacturer packaging.'
      })
    });
    assert.strictEqual(res.status, 201);

    // Verify rating updated on product
    const prod = await Product.findById(testProductId);
    assert(prod.ratingCount >= 1, 'ratingCount must be at least 1');
    assert(prod.ratingAverage > 0 && prod.ratingAverage <= 5, 'Rating must be between 1 and 5');
  });

  // TEST 21: Contact Message Submission
  await runTest('POST /api/contact should record customer inquiry', async () => {
    const res = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Pooja Verma',
        email: 'pooja.verma@example.com',
        phone: '9845098450',
        subject: 'Product Warranty Query',
        message: 'Does the Samsung Refrigerator include a 10-year compressor warranty?'
      })
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
  });

  // TEST 22: Security - Non-Admin Access Forbidden
  await runTest('GET /api/admin/dashboard/stats with customer token should return 403 Forbidden', async () => {
    const res = await fetch(`${BASE_URL}/admin/dashboard/stats`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert.strictEqual(res.status, 403, 'Customer should be denied access with 403');
  });

  // TEST 23: Admin Dashboard Analytics
  await runTest('GET /api/admin/dashboard/stats with admin token should return stats and sales', async () => {
    const res = await fetch(`${BASE_URL}/admin/dashboard/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(typeof data.stats.totalSales === 'number', 'totalSales must be a number');
    assert(typeof data.stats.totalOrders === 'number', 'totalOrders must be a number');
    assert(typeof data.stats.totalProducts === 'number', 'totalProducts must be a number');
  });

  // SUMMARY REPORT
  console.log('\n========================================================');
  console.log(`📊 TEST SUITE SUMMARY: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
  console.log('========================================================\n');

  // Teardown
  if (server) {
    server.close();
  }
  await mongoose.disconnect();

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

startSuite().catch((err) => {
  console.error('Fatal Test Suite Error:', err);
  process.exit(1);
});
