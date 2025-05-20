import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, runTransaction } from 'firebase/firestore';

const CartContext = createContext({
  cartItems: [],
  isCartOpen: false,
  openCart: () => {},
  closeCart: () => {},
  clearCart: () => {},
  addToCart: async () => {},
  removeFromCart: () => {},
  updateQuantity: async () => {},
  getCartByBranch: () => ({}),
  updateInventoryAfterPurchase: async () => {},
});

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
      let parsed = [];
      try {
        parsed = JSON.parse(savedCart);
      } catch (e) {
        parsed = [];
      }
      // Filtrar productos inválidos (sin id o price válido)
      const cleaned = parsed.filter(item => {
        const validId = !!item.id;
        let price = item.price;
        if (typeof price === 'string') price = parseFloat(price.replace(/[^\d.]/g, ''));
        return validId && !isNaN(price) && price > 0;
      });
      setCartItems(cleaned);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const checkInventory = async (productId, flavorId, quantity, branch) => {
    try {
      const inventarioRef = doc(db, 'inventario', branch);
      const inventarioSnap = await getDoc(inventarioRef);
      
      if (!inventarioSnap.exists()) {
        console.error('Inventario no encontrado para la sucursal:', branch);
        return false;
      }

      const inventario = inventarioSnap.data();
      const productStock = inventario[productId];
      
      if (!productStock) {
        console.error('Producto no encontrado en el inventario:', productId);
        return false;
      }

      if (flavorId) {
        const flavorStock = productStock.flavors?.[flavorId] || 0;
        return flavorStock >= quantity;
      } else {
        const defaultStock = productStock.stock || 0;
        return defaultStock >= quantity;
      }
    } catch (error) {
      console.error('Error checking inventory:', error);
      return false;
    }
  };

  const addToCart = async (product, quantity = 1, flavor = null, branch) => {
    try {
      if (!branch) {
        throw new Error('Debes seleccionar una sucursal');
      }
      const flavorId = flavor?.id || null;
      console.log('Intentando agregar al carrito:', { 
        productId: product.id, 
        flavorId, 
        quantity, 
        branch,
        product
      });
      const hasStock = await checkInventory(product.id, flavorId, quantity, branch);
      console.log('Resultado de verificación de stock:', hasStock);
      if (!hasStock) {
        throw new Error('No hay suficiente stock disponible');
      }
      setCartItems(prevItems => {
        const cartKey = `${product.id}-${flavorId || 'default'}-${branch}`;
        const existingItem = prevItems.find(item => item.cartKey === cartKey);
        let price = product.price;
        if (typeof price === 'string') price = parseFloat(price.replace(/[^\d.]/g, ''));
        if (isNaN(price) || price <= 0) price = 1; // fallback mínimo
        // Obtener la imagen correcta según el sabor
        let productImage = '';
        if (flavor && flavor.images && flavor.images.length > 0) {
          productImage = flavor.images[0];
        } else if (product.images && product.images.length > 0) {
          productImage = product.images[0];
        } else {
          productImage = '/images/productos/default.png';
        }
        if (existingItem) {
          return prevItems.map(item =>
            item.cartKey === cartKey
              ? { ...item, quantity: item.quantity + quantity, price, image: productImage }
              : item
          );
        }
        return [...prevItems, { 
          ...product, 
          quantity, 
          flavor, 
          branch, 
          price, 
          cartKey,
          image: productImage 
        }];
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeFromCart = (cartKey) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartKey !== cartKey));
  };

  const updateQuantity = async (cartKey, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(cartKey);
      return;
    }

    const item = cartItems.find(item => item.cartKey === cartKey);
    if (!item) return;

    try {
      const hasStock = await checkInventory(item.id, item.flavor?.id, newQuantity, item.branch);
      if (!hasStock) {
        throw new Error('No hay suficiente stock disponible');
      }

      setCartItems(prevItems =>
        prevItems.map(item =>
          item.cartKey === cartKey
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  };

  const getCartByBranch = () => {
    return cartItems.reduce((acc, item) => {
      if (!acc[item.branch]) {
        acc[item.branch] = [];
      }
      acc[item.branch].push(item);
      return acc;
    }, {});
  };

  const updateInventoryAfterPurchase = async (items) => {
    try {
      // Agrupar items por sucursal
      const itemsByBranch = items.reduce((acc, item) => {
        if (!acc[item.branch]) {
          acc[item.branch] = [];
        }
        acc[item.branch].push(item);
        return acc;
      }, {});

      // Actualizar inventario por sucursal
      for (const [branch, branchItems] of Object.entries(itemsByBranch)) {
        const inventarioRef = doc(db, 'inventario', branch);
        await runTransaction(db, async (transaction) => {
          const inventarioDoc = await transaction.get(inventarioRef);
          if (!inventarioDoc.exists()) {
            throw new Error(`Inventario no encontrado para la sucursal: ${branch}`);
          }

          const inventario = inventarioDoc.data();
          const updatedInventario = { ...inventario };

          for (const item of branchItems) {
            const productStock = updatedInventario[item.id] || { stock: 0 };
            
            if (item.flavor?.id) {
              // Actualizar stock de sabor específico
              const flavors = productStock.flavors || {};
              const currentStock = flavors[item.flavor.id] || 0;
              const newStock = Math.max(0, currentStock - item.quantity);
              
              updatedInventario[item.id] = {
                ...productStock,
                flavors: {
                  ...flavors,
                  [item.flavor.id]: newStock
                }
              };
            } else {
              // Actualizar stock general
              const currentStock = productStock.stock || 0;
              const newStock = Math.max(0, currentStock - item.quantity);
              
              updatedInventario[item.id] = {
                ...productStock,
                stock: newStock
              };
            }
          }

          transaction.update(inventarioRef, updatedInventario);
        });
      }
    } catch (error) {
      console.error('Error updating inventory:', error);
      throw error;
    }
  };

  const value = {
    cartItems,
    isCartOpen,
    openCart,
    closeCart,
    clearCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartByBranch,
    updateInventoryAfterPurchase,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
} 