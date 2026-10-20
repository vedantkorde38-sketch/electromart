const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const User = require('../models/User');

// Helper to generate unique order number: EM-YYYYMMDD-XXXX
const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `EM-${dateStr}-${randomSuffix}`;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod = 'COD', couponCode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required'
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required'
      });
    }

    // 1. Re-verify each product from DB: check existence, price, and stock
    const verifiedItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const productId = item.productId || item.product?._id || item.product;
      const quantity = parseInt(item.quantity, 10);

      if (!productId || isNaN(quantity) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Invalid item format or quantity'
        });
      }

      const product = await Product.findById(productId);
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product "${item.name || productId}" is no longer available`
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${quantity}`
        });
      }

      const itemPrice = product.price; // Always use DB price! Never trust frontend!
      const itemSubtotal = itemPrice * quantity;
      calculatedSubtotal += itemSubtotal;

      verifiedItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || '/placeholder-electronics.svg',
        price: itemPrice,
        quantity
      });
    }

    // 2. Calculate shipping: Free delivery if subtotal >= ₹999, else ₹99
    const shippingFee = calculatedSubtotal >= 999 ? 0 : 99;

    // 3. Validate coupon if provided
    let calculatedDiscount = 0;
    let appliedCoupon = null;

    if (couponCode && couponCode.trim()) {
      const code = couponCode.trim().toUpperCase();
      const coupon = await Coupon.findOne({
        code,
        isActive: true,
        expiresAt: { $gt: new Date() }
      });

      if (coupon) {
        if (calculatedSubtotal >= coupon.minimumOrderValue) {
          if (coupon.discountType === 'percentage') {
            let disc = (calculatedSubtotal * coupon.discountValue) / 100;
            if (coupon.maximumDiscount && disc > coupon.maximumDiscount) {
              disc = coupon.maximumDiscount;
            }
            calculatedDiscount = Math.round(disc);
          } else {
            calculatedDiscount = Math.min(coupon.discountValue, calculatedSubtotal);
          }
          appliedCoupon = coupon;
        }
      }
    }

    const totalAmount = Math.max(0, calculatedSubtotal + shippingFee - calculatedDiscount);

    // 4. Safely decrement stock using atomic checks to prevent overselling
    for (const item of verifiedItems) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      if (!updated) {
        // Rollback any previously decremented items
        for (const rolledBackItem of verifiedItems) {
          if (rolledBackItem.product.toString() === item.product.toString()) break;
          await Product.findByIdAndUpdate(rolledBackItem.product, {
            $inc: { stock: rolledBackItem.quantity }
          });
        }
        return res.status(400).json({
          success: false,
          message: `Stock update failed for "${item.name}". Another purchase may have just occurred.`
        });
      }
    }

    // 5. Update coupon usage count if used
    if (appliedCoupon) {
      await Coupon.findByIdAndUpdate(appliedCoupon._id, { $inc: { usedCount: 1 } });
    }

    // 6. Create order record
    const orderNumber = generateOrderNumber();
    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      items: verifiedItems,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone.trim(),
        street: shippingAddress.street.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        postalCode: shippingAddress.postalCode.trim(),
        country: shippingAddress.country || 'India'
      },
      subtotal: calculatedSubtotal,
      discount: calculatedDiscount,
      shippingFee,
      totalAmount,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      paymentMethod: paymentMethod === 'ONLINE_DEMO' ? 'ONLINE_DEMO' : 'COD',
      paymentStatus: paymentMethod === 'ONLINE_DEMO' ? 'Completed' : 'Pending',
      orderStatus: 'Confirmed'
    });

    // 7. Clear user cart upon successful order
    await User.findByIdAndUpdate(req.user._id, { cart: [] });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID or orderNumber
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id).populate('user', 'name email phone');
    } else {
      order = await Order.findOne({ orderNumber: id }).populate('user', 'name email phone');
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Enforce authorization: only order owner or admin can view
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to view this order'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (by customer if eligible)
// @route   PATCH /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify ownership (unless admin)
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
    }

    // Cancellation rule: can only cancel if Pending or Confirmed
    if (!['Pending', 'Confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already ${order.orderStatus}`
      });
    }

    order.orderStatus = 'Cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = reason || 'Customer requested cancellation';

    if (order.paymentStatus === 'Completed') {
      order.paymentStatus = 'Refunded';
    }

    await order.save();

    // Safely restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    res.json({
      success: true,
      message: 'Order has been cancelled and stock restored',
      order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder
};
