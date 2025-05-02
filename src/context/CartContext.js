import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item) => {
    setCartItems((prev) => {
      // Check if item already exists in cart
      const existingItemIndex = prev.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex > -1) {
        // If item exists, update its quantity
        const updatedItems = [...prev];
        const existingItem = updatedItems[existingItemIndex];
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: (existingItem.quantity || 1) + (item.quantity || 1)
        };
        return updatedItems;
      } else {
        // If item doesn't exist, add it to cart
        return [...prev, item];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter(item => item.id !== id));
  };

  const updateCartItem = (id, updates) => {
    setCartItems((prev) => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartItem, isCartOpen, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
} 