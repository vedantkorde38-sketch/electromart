const User = require('../models/User');
const Product = require('../models/Product');

// Helper to format cart response with computed subtotal and stock validation
const formatCartResponse = async (userCart) => {
  const populated = await Promise.all(
    userCart.map(async (item) => {
      const prod = await Product.findById(item.product).populate('category', 'name slug');
      if (!prod || !prod.isActive) return null;
      return {
        product: prod,
        quantity: Math.min(item.quantity, prod.stock > 0 ? prod.stock : 1),
        isAvailable: prod.stock > 0,
        availableStock: prod.stock
      };
    })
  );

  const validItems = populated.filter(Boolean);
  const subtotal = validItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return {
    items: validItems,
    itemCount: validItems.reduce((acc, item) => acc + item.quantity, 0),
    subtotal
  };
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const cartData = await formatCartResponse(user.cart);
    res.json({
      success: true,
      ...cartData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found or inactive' });
    }

    if (product.stock < 1) {
      return res.status(400).json({ success: false, message: 'Product is currently out of stock' });
    }

    const user = await User.findById(req.user._id);
    const existingIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    const qtyToAdd = Math.max(1, parseInt(quantity, 10));

    if (existingIndex > -1) {
      const newQty = user.cart[existingIndex].quantity + qtyToAdd;
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} unit(s) available in stock`
        });
      }
      user.cart[existingIndex].quantity = newQty;
    } else {
      if (qtyToAdd > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} unit(s) available in stock`
        });
      }
      user.cart.push({ product: productId, quantity: qtyToAdd });
    }

    await user.save();
    const cartData = await formatCartResponse(user.cart);

    res.json({
      success: true,
      message: 'Product added to cart',
      ...cartData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:productId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (qty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} unit(s) available in stock`
      });
    }

    const user = await User.findById(req.user._id);
    const item = user.cart.find((i) => i.product.toString() === productId.toString());

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    item.quantity = qty;
    await user.save();

    const cartData = await formatCartResponse(user.cart);
    res.json({
      success: true,
      message: 'Cart updated',
      ...cartData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId.toString()
    );

    await user.save();

    const cartData = await formatCartResponse(user.cart);
    res.json({
      success: true,
      message: 'Item removed from cart',
      ...cartData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      items: [],
      itemCount: 0,
      subtotal: 0
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Merge guest cart into user cart after login
// @route   POST /api/cart/merge
// @access  Private
const mergeCart = async (req, res, next) => {
  try {
    const { items = [] } = req.body;
    const user = await User.findById(req.user._id);

    for (const guestItem of items) {
      if (!guestItem.productId) continue;
      const product = await Product.findById(guestItem.productId);
      if (!product || !product.isActive || product.stock < 1) continue;

      const existing = user.cart.find(
        (i) => i.product.toString() === guestItem.productId.toString()
      );

      const qty = Math.min(
        parseInt(guestItem.quantity, 10) || 1,
        product.stock
      );

      if (existing) {
        existing.quantity = Math.min(existing.quantity + qty, product.stock);
      } else {
        user.cart.push({ product: guestItem.productId, quantity: qty });
      }
    }

    await user.save();
    const cartData = await formatCartResponse(user.cart);

    res.json({
      success: true,
      message: 'Cart merged successfully',
      ...cartData
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCart
};
