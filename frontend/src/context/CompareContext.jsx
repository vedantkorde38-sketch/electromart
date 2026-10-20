import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const { showToast } = useToast();
  const [compareItems, setCompareItems] = useState(() => {
    try {
      const saved = localStorage.getItem('electromart_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('electromart_compare', JSON.stringify(compareItems));
    } catch {
      // storage quota / unavailable
    }
  }, [compareItems]);

  const addToCompare = (product) => {
    if (!product || !product._id) return;

    if (compareItems.some((item) => item._id === product._id)) {
      showToast(`${product.name} is already in comparison!`, 'info');
      return;
    }

    if (compareItems.length >= 4) {
      showToast('You can compare a maximum of 4 electronics at a time.', 'warning');
      return;
    }

    setCompareItems((prev) => [...prev, product]);
    showToast(`Added "${product.name}" to Comparison matrix`, 'success');
  };

  const removeFromCompare = (productId) => {
    setCompareItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isInCompare = (productId) => {
    return compareItems.some((item) => item._id === productId);
  };

  const toggleCompare = (product) => {
    if (isInCompare(product._id)) {
      removeFromCompare(product._id);
    } else {
      addToCompare(product);
    }
  };

  const openCompareModal = () => {
    if (compareItems.length === 0) {
      showToast('Select at least 1 product to compare', 'info');
      return;
    }
    setIsCompareModalOpen(true);
  };

  const closeCompareModal = () => {
    setIsCompareModalOpen(false);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        compareCount: compareItems.length,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        clearCompare,
        isInCompare,
        isCompareModalOpen,
        openCompareModal,
        closeCompareModal
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

export default CompareContext;
