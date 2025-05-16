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
      if (!inventarioSnap.exists()) {
        console.log('No existe inventario para la sucursal:', branch);
        return false;
      }
      const inventario = inventarioSnap.data();
      const product = inventario[productId];
      if (!product) {
        console.log('No existe el producto en el inventario:', productId);
        return false;
      }

      let stock;
      if (product.flavors && flavorId) {
        stock = product.flavors[flavorId];
        console.log('Verificando stock con sabor:', { branch, productId, flavorId, stock, quantity });
      } else {
        stock = product.stock;
        console.log('Verificando stock sin sabor:', { branch, productId, stock, quantity });
      }

      stock = Number(stock);
      if (isNaN(stock)) {
        console.log('Stock inválido:', stock);
        return false;
      }

      console.log('Stock final:', { stock, quantity, result: stock >= quantity });
      return stock >= quantity;
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
        if (typeof price === 'string') {
          price = parseFloat(price.replace(/[^\d.]/g, ''));
        }
        if (isNaN(price)) price = 0;

        // Obtener la imagen correcta según el sabor
        let productImage;
        if (flavor && flavor.images && flavor.images.length > 0) {
          productImage = flavor.images[0];
        } else if (product.images && product.images.length > 0) {
          productImage = product.images[0];
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
      console.error('Error al agregar al carrito:', error);
      throw error;
    }
  };

  const removeFromCart = (cartKey) => {
    console.log('Intentando eliminar del carrito:', { cartKey });
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.cartKey !== cartKey);
      console.log('Carrito después de eliminar:', newItems);
      return newItems;
    });
  };

  const updateQuantity = async (cartKey, newQuantity) => {
    try {
      const item = cartItems.find(item => item.cartKey === cartKey);
      if (!item) {
        throw new Error('Producto no encontrado en el carrito');
      }

      const hasStock = await checkInventory(item.id, item.flavor?.id, newQuantity, item.branch);
      console.log('Verificación de stock para actualizar cantidad:', { cartKey, newQuantity, hasStock });

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
      console.error('Error al actualizar cantidad:', error);
      throw error;
    }
  };

  const getCartByBranch = () => {
    const branches = {};
    cartItems.forEach(item => {
      if (!branches[item.branch]) {
        branches[item.branch] = [];
      }
      branches[item.branch].push(item);
    });
    return branches;
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

  const updateCartItem = (itemId, updates) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    );
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
    updateInventoryAfterPurchase,
    updateCartItem,
    getCartByBranch
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
} 