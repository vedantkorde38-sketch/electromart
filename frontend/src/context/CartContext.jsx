import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('electromart_guest_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [coupon, setCoupon] = useState(null);
  const [tradeIn, setTradeIn] = useState(() => {
    try {
      const saved = localStorage.getItem('electromart_trade_in');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Sync cart from server for logged in user
  const fetchServerCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const { data } = await api.get('/cart');
      if (data.success && data.items) {
        setCartItems(data.items);
      }
    } catch (err) {
      console.error('Failed to fetch server cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Merge guest cart when user logs in
  useEffect(() => {
    const syncOnLogin = async () => {
      if (isAuthenticated) {
        const guestCart = localStorage.getItem('electromart_guest_cart');
        if (guestCart) {
          try {
            const parsed = JSON.parse(guestCart);
            if (parsed.length > 0) {
              const itemsToMerge = parsed.map((item) => ({
                productId: item.product._id,
                quantity: item.quantity
              }));
              await api.post('/cart/merge', { items: itemsToMerge });
              localStorage.removeItem('electromart_guest_cart');
            }
          } catch (err) {
            console.error('Cart merge failed:', err);
          }
        }
        fetchServerCart();
      }
    };

    syncOnLogin();
  }, [isAuthenticated, fetchServerCart]);

  // Persist guest cart locally if unauthenticated
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('electromart_guest_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  // Add to cart
  const addToCart = async (product, quantity = 1) => {
    const qty = Math.max(1, parseInt(quantity, 10));

    if (product.stock < 1) {
      showToast('Sorry, this product is currently out of stock', 'error');
      return false;
    }

    if (isAuthenticated) {
      try {
        const { data } = await api.post('/cart/items', {
          productId: product._id,
          quantity: qty
        });
        if (data.success) {
          setCartItems(data.items);
          showToast(`Added ${product.name.slice(0, 32)}... to cart`, 'success');
          return true;
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Could not add to cart';
        showToast(msg, 'error');
        return false;
      }
    } else {
      // Guest user state handling
      setCartItems((prev) => {
        const existingIdx = prev.findIndex((item) => item.product._id === product._id);
        if (existingIdx > -1) {
          const newQty = prev[existingIdx].quantity + qty;
          if (newQty > product.stock) {
            showToast(`Only ${product.stock} units available in stock`, 'error');
            return prev;
          }
          const updated = [...prev];
          updated[existingIdx].quantity = newQty;
          showToast(`Updated quantity in cart`, 'success');
          return updated;
        } else {
          if (qty > product.stock) {
            showToast(`Only ${product.stock} units available in stock`, 'error');
            return prev;
          }
          showToast(`Added ${product.name.slice(0, 32)}... to cart`, 'success');
          return [...prev, { product, quantity: qty, isAvailable: true, availableStock: product.stock }];
        }
      });
      return true;
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) return;

    if (isAuthenticated) {
      try {
        const { data } = await api.put(`/cart/items/${productId}`, { quantity: qty });
        if (data.success) {
          setCartItems(data.items);
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to update quantity';
        showToast(msg, 'error');
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) => {
          if (item.product._id === productId) {
            if (qty > item.product.stock) {
              showToast(`Only ${item.product.stock} items available`, 'error');
              return item;
            }
            return { ...item, quantity: qty };
          }
          return item;
        })
      );
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        const { data } = await api.delete(`/cart/items/${productId}`);
        if (data.success) {
          setCartItems(data.items);
          showToast('Item removed from cart', 'info');
        }
      } catch (err) {
        showToast('Failed to remove item', 'error');
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item.product._id !== productId));
      showToast('Item removed from cart', 'info');
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await api.delete('/cart');
        setCartItems([]);
        setCoupon(null);
        setTradeIn(null);
        localStorage.removeItem('electromart_trade_in');
      } catch (err) {
        console.error('Failed to clear cart:', err);
      }
    } else {
      setCartItems([]);
      setCoupon(null);
      setTradeIn(null);
      localStorage.removeItem('electromart_guest_cart');
      localStorage.removeItem('electromart_trade_in');
    }
  };

  // Subtotal calculation
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  // Delivery fee: Free if subtotal >= ₹999, else ₹99 (if cart has items)
  const shippingFee = cartItems.length === 0 ? 0 : subtotal >= 999 ? 0 : 99;

  // Coupon discount calculation
  let discount = 0;
  if (coupon && subtotal >= coupon.minimumOrderValue) {
    if (coupon.discountType === 'percentage') {
      let disc = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maximumDiscount && disc > coupon.maximumDiscount) {
        disc = coupon.maximumDiscount;
      }
      discount = disc;
    } else {
      discount = Math.min(coupon.discountValue, subtotal);
    }
  }

  // Trade-In credit calculation (capped at subtotal after coupon discount)
  const tradeInCredit = tradeIn && subtotal > 0
    ? Math.min(tradeIn.value, Math.max(0, subtotal - discount))
    : 0;

  const total = Math.max(0, subtotal + shippingFee - discount - tradeInCredit);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Apply coupon via backend validation
  const applyCoupon = async (code) => {
    if (!code || !code.trim()) {
      showToast('Please enter a coupon code', 'error');
      return false;
    }

    try {
      const { data } = await api.post('/coupons/validate', {
        code: code.trim(),
        cartTotal: subtotal
      });

      if (data.success && data.coupon) {
        setCoupon(data.coupon);
        showToast(`Coupon "${data.coupon.code}" applied successfully!`, 'success');
        return true;
      }
      return false;
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired coupon code';
      showToast(msg, 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Trade-In methods
  const applyTradeIn = (tradeData) => {
    setTradeIn(tradeData);
    try {
      localStorage.setItem('electromart_trade_in', JSON.stringify(tradeData));
    } catch (e) {
      console.error('Failed to save trade-in to localStorage:', e);
    }
    showToast(`Exchange Discount of ₹${tradeData.value.toLocaleString('en-IN')} applied!`, 'success');
  };

  const removeTradeIn = () => {
    setTradeIn(null);
    localStorage.removeItem('electromart_trade_in');
    showToast('Exchange discount removed', 'info');
  };

  const value = {
    cartItems,
    itemCount,
    subtotal,
    shippingFee,
    discount,
    tradeIn,
    tradeInCredit,
    total,
    coupon,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    applyTradeIn,
    removeTradeIn,
    refreshCart: fetchServerCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
