import { useState, useEffect, useCallback } from 'react';

const WISHLIST_KEY = 'sc_wishlist';

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const toggleWishlist = useCallback((product) => {
    setWishlistItems(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const isWishlisted = useCallback((productId) => {
    return wishlistItems.some(p => p.id === productId);
  }, [wishlistItems]);

  const removeFromWishlist = useCallback((productId) => {
    setWishlistItems(prev => prev.filter(p => p.id !== productId));
  }, []);

  return {
    wishlistItems,
    toggleWishlist,
    isWishlisted,
    removeFromWishlist,
    wishlistCount: wishlistItems.length,
  };
};
