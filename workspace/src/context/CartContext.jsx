import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { getSessionId } from '../utils/session';

const CartContext = createContext();

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);

  const sessionId = getSessionId();

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await api.getCart(sessionId);
      if (response.success) {
        setCart(response.cart);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await api.addToCart(sessionId, productId, quantity);
      if (response.success) {
        setCart(response.cart);
        return { success: true, message: response.message };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: error.message };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      const response = await api.updateCartItem(sessionId, productId, quantity);
      if (response.success) {
        setCart(response.cart);
        return { success: true, message: response.message };
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      return { success: false, message: error.message };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await api.removeFromCart(sessionId, productId);
      if (response.success) {
        setCart(response.cart);
        return { success: true, message: response.message };
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false, message: error.message };
    }
  };

  const clearCart = async () => {
    try {
      const response = await api.clearCart(sessionId);
      if (response.success) {
        setCart(response.cart);
        return { success: true, message: response.message };
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, message: error.message };
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

