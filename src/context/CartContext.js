import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, runTransaction } from 'firebase/firestore';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const checkInventory = async (productId, flavorId, quantity, branch) => {
    try {
      const inventarioRef = doc(db, 'inventario', branch);
      const inventarioSnap = await getDoc(inventarioRef);
      if (!inventarioSnap.exists()) return false;
      const inventario = inventarioSnap.data();
      const product = inventario[productId];
      if (!product) return false;
      if (product.flavors && flavorId) {
        return product.flavors[flavorId] >= quantity;
      } else if (!product.flavors) {
        return product.stock >= quantity;
      }
      return false;
    } catch (error) {
      console.error('Error checking inventory:', error);
      return false;
    }
  };

  const addToCart = async (product, quantity = 1, flavor = null, branch) => {
    try {
      const flavorId = flavor?.id || null;
      const hasStock = await checkInventory(product.id, flavorId, quantity, branch);
      if (!hasStock) {
        throw new Error('No hay suficiente stock disponible');
      }
      setCartItems(prevItems => {
        const existingItem = prevItems.find(
          item => item.id === product.id && (item.flavor?.id || null) === flavorId
        );
        if (existingItem) {
          return prevItems.map(item =>
            item.id === product.id && (item.flavor?.id || null) === flavorId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prevItems, { ...product, quantity, flavor, branch }];
      });
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = (productId, flavorId = 'default') => {
    setCartItems(prevItems =>
      prevItems.filter(item => !(item.id === productId && item.flavor?.id === flavorId))
    );
  };

  const updateQuantity = async (productId, flavorId = 'default', newQuantity, branch) => {
    try {
      const hasStock = await checkInventory(productId, flavorId, newQuantity, branch);

      if (!hasStock) {
        throw new Error('No hay suficiente stock disponible');
      }

      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId && item.flavor?.id === flavorId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      throw error;
    }
  };

  const updateInventoryAfterPurchase = async (items) => {
    const branch = items[0]?.branch;
    if (!branch) return;

    const inventarioRef = doc(db, 'inventario', branch);
    
    try {
      await runTransaction(db, async (transaction) => {
        const inventarioDoc = await transaction.get(inventarioRef);
        if (!inventarioDoc.exists()) {
          throw new Error('No se encontró el inventario');
        }

        const inventario = inventarioDoc.data();
        const newInventario = { ...inventario };

        items.forEach(item => {
          const productId = item.id;
          const flavorId = item.flavor?.id || 'default';
          const quantity = item.quantity;

          if (!newInventario[productId]) return;

          if (flavorId === 'default') {
            newInventario[productId].stock -= quantity;
          } else {
            newInventario[productId].flavors[flavorId] -= quantity;
          }
        });

        transaction.update(inventarioRef, newInventario);
      });
    } catch (error) {
      console.error('Error updating inventory:', error);
      throw error;
    }
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    openCart,
    closeCart,
    updateInventoryAfterPurchase
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
} 