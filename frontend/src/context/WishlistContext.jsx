import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('electromart_guest_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  // Sync wishlist from server when logged in
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const { data } = await api.get('/wishlist');
      if (data.success && data.wishlist) {
        setWishlist(data.wishlist);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, fetchWishlist]);

  // Persist guest wishlist
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('electromart_guest_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isAuthenticated]);

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlist.some((item) => {
      const id = item._id || item;
      return id.toString() === productId.toString();
    });
  };

  const addToWishlist = async (product) => {
    if (isInWishlist(product._id)) return;

    if (isAuthenticated) {
      try {
        const { data } = await api.post(`/wishlist/${product._id}`);
        if (data.success) {
          setWishlist((prev) => [...prev, product]);
          showToast(`Added "${product.name.slice(0, 28)}..." to Wishlist`, 'success');
        }
      } catch (err) {
        showToast('Could not add to wishlist', 'error');
      }
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Added to Wishlist`, 'success');
    }
  };

  const removeFromWishlist = async (productId) => {
    if (isAuthenticated) {
      try {
        const { data } = await api.delete(`/wishlist/${productId}`);
        if (data.success) {
          setWishlist((prev) => prev.filter((item) => (item._id || item) !== productId));
          showToast('Removed from Wishlist', 'info');
        }
      } catch (err) {
        showToast('Failed to remove from wishlist', 'error');
      }
    } else {
      setWishlist((prev) => prev.filter((item) => (item._id || item) !== productId));
      showToast('Removed from Wishlist', 'info');
    }
  };

  const toggleWishlist = async (product) => {
    if (isInWishlist(product._id)) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product);
    }
  };

  const value = {
    wishlist,
    wishlistCount: wishlist.length,
    loading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    refreshWishlist: fetchWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
