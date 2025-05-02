import React, { useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { usePickupModal } from '../context/PickupModalContext';

export default function CartDrawer() {
  const { cartItems, isCartOpen, closeCart, removeFromCart, updateCartItem } = useCart();
  const { openPickupModal } = usePickupModal();
  const drawerRef = useRef();

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (isCartOpen && drawerRef.current && !drawerRef.current.contains(e.target)) {
        closeCart();
      }
    }
    if (isCartOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isCartOpen, closeCart]);

  // Prevent body scroll when cart is open
  useEffect(() => {
    const html = document.documentElement;
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      html.style.overflow = 'hidden';
      // Optional: prevent layout shift
      const scrollBarComp = window.innerWidth - document.documentElement.clientWidth;
      if (scrollBarComp > 0) {
        document.body.style.paddingRight = scrollBarComp + 'px';
      }
    } else {
      document.body.style.overflow = '';
      html.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      html.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isCartOpen]);

  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  // Calculate total quantity
  const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleQuantityChange = (itemId, change) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      const newQuantity = (item.quantity || 1) + change;
      if (newQuantity >= 1) {
        updateCartItem(itemId, { quantity: newQuantity });
      }
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[100]">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/30"
            onClick={closeCart}
          />
          {/* Drawer */}
          <motion.aside
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl rounded-l-3xl flex flex-col overflow-hidden"
          >
            <button
              className="absolute top-6 right-6 text-3xl text-gray-400 hover:text-gray-700 z-10"
              onClick={closeCart}
              aria-label="Cerrar"
            >
              &times;
            </button>
            <div className="p-8 pb-4 h-full flex flex-col">
              <h2 className="text-3xl font-bold text-[#222] mb-6">Cesta <span className="text-lg font-normal">({totalQuantity})</span></h2>
              <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="text-center text-gray-400 mt-16">Tu carrito está vacío.</div>
                ) : cartItems.map(item => (
                  <div key={item.id} className="flex gap-4 items-center border-b border-gray-100 pb-6">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-contain bg-gray-50 rounded-xl" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-base text-gray-700 font-medium">{item.name}</div>
                          {item.flavor && (
                            <div className="text-sm text-gray-500">{item.flavor}</div>
                          )}
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)} 
                          className="text-gray-400 hover:text-red-500 transition-colors duration-300" 
                          title="Eliminar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="px-3 py-1 text-[#5773BB] hover:text-[#00BFB3] transition-colors duration-300"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 border-x border-gray-200">{item.quantity || 1}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="px-3 py-1 text-[#5773BB] hover:text-[#00BFB3] transition-colors duration-300"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-bold text-lg text-[#222]">MXN {item.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Fixed bottom section */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                {/* Promo code */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🏷️</span>
                  <input
                    type="text"
                    placeholder="Código promocional"
                    className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[#5773BB]"
                  />
                  <button className="text-[#5773BB] font-semibold ml-2">Añadir</button>
                </div>
                {/* Total */}
                <div className="flex items-center justify-between text-xl font-bold mb-4">
                  <span>Total <span className="text-base font-normal text-gray-500">(IVA Incluido)</span></span>
                  <span>MXN {total.toFixed(2)}</span>
                </div>
                {/* Checkout button */}
                <button
                  className="w-full bg-[#00BFB3] hover:bg-[#00A89D] text-white font-bold py-4 rounded-xl text-lg transition-all"
                  onClick={() => {
                    closeCart();
                    setTimeout(() => openPickupModal(), 300);
                  }}
                >
                  Tramitar pedido
                </button>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
} 