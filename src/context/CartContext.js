import React, { createContext, useCallback, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [notice, setNotice] = useState('');

  const showNotice = useCallback((message) => {
    setNotice(message);
  }, []);

  const clearNotice = useCallback(() => {
    setNotice('');
  }, []);

  const addToCart = (product, quantity = 1) => {
    const normalizedQuantity = Math.max(1, quantity);
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + normalizedQuantity }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: normalizedQuantity }]);
    }

    showNotice(`Đã thêm ${normalizedQuantity} "${product.name}" vào giỏ hàng.`);
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(cartItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, getTotalPrice, clearCart, notice, clearNotice, showNotice }}>
      {children}
    </CartContext.Provider>
  );
};
