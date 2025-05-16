import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { usePickupModal } from '../context/PickupModalContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const cartContext = useCart();
  // LOG: Mostrar el contexto completo
  console.log('[CartDrawer] useCart context:', cartContext);
  const { cartItems = [], isCartOpen, closeCart, removeFromCart, updateQuantity, getCartByBranch } = cartContext || {};
  const { openPickupModal } = usePickupModal();
  const drawerRef = useRef();
  const navigate = useNavigate();
  const [cartError, setCartError] = useState('');

  // Agrupar productos por sucursal
  const cartByBranch = typeof getCartByBranch === 'function' ? getCartByBranch() : {};
  // LOG: Mostrar agrupación de carrito
  console.log('[CartDrawer] cartByBranch:', cartByBranch);

  // Función para obtener la imagen del producto
  const getProductImage = (item) => {
    if (!item.image) return '/images/productos/default.png';
    if (item.image.startsWith('http')) return item.image;
    return item.image.startsWith('/') ? item.image : `/${item.image}`;
  };

  // Close on outside click/touch
  useEffect(() => {
    function handleOutsideClick(e) {
      if (isCartOpen && drawerRef.current && !drawerRef.current.contains(e.target)) {
        closeCart && closeCart();
      }
    }
    
    if (isCartOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick, { passive: false });
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isCartOpen, closeCart]);

  // Prevent body scroll when cart is open
  useEffect(() => {
    const html = document.documentElement;
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      html.style.overflow = 'hidden';
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

  // Calcular total general
  const total = (cartItems || []).reduce((sum, item) => {
    const price = Number(item.price);
    const quantity = Number(item.quantity) || 1;
    if (isNaN(price)) {
      console.error('[CartDrawer] Precio inválido para item:', item);
      return sum;
    }
    return sum + price * quantity;
  }, 0);
  // LOG: Mostrar total calculado
  console.log('[CartDrawer] total:', total);

  // Calcular cantidad total
  const totalQuantity = (cartItems || []).reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

  // Cambiar cantidad
  const handleQuantityChange = async (item, change) => {
    const newQuantity = (Number(item.quantity) || 1) + change;
    if (newQuantity < 1) return;
    if (typeof updateQuantity !== 'function') {
      setCartError('Error: updateQuantity no está disponible');
      console.error('[CartDrawer] updateQuantity no es función:', updateQuantity);
      return;
    }
    try {
      await updateQuantity(item.cartKey, newQuantity);
      setCartError('');
    } catch (err) {
      setCartError(err.message);
      console.error('[CartDrawer] Error al actualizar cantidad:', err);
    }
  };

  // Eliminar producto
  const handleRemove = (item) => {
    if (typeof removeFromCart !== 'function') {
      setCartError('Error: removeFromCart no está disponible');
      console.error('[CartDrawer] removeFromCart no es función:', removeFromCart);
      return;
    }
    removeFromCart(item.cartKey);
    setCartError('');
  };

  // Manejar checkout
  const handleCheckout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeCart && closeCart();
    setTimeout(() => navigate('/checkout'), 300);
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
            style={{ touchAction: 'none' }}
          />
          {/* Drawer */}
          <motion.aside
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl rounded-l-3xl flex flex-col overflow-hidden"
            style={{ touchAction: 'pan-y' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-6 right-6 text-3xl text-gray-400 hover:text-gray-700 z-10 touch-manipulation"
              onClick={(e) => {
                e.stopPropagation();
                closeCart && closeCart();
              }}
              aria-label="Cerrar"
            >
              &times;
            </button>
            <div className="p-8 pb-4 h-full flex flex-col">
              <h2 className="text-3xl font-bold text-[#222] mb-6">Cesta <span className="text-lg font-normal">({totalQuantity})</span></h2>
              {cartError && (
                <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center font-semibold">
                  {cartError}
                </div>
              )}
              <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="text-center text-gray-400 mt-16">Tu carrito está vacío.</div>
                ) : (
                  Object.entries(cartByBranch).map(([branch, items]) => (
                    <div key={branch} className="mb-8">
                      <div className="font-bold text-[#5773BB] mb-2">Sucursal: {branch}</div>
                      {items.map(item => (
                        <div key={item.cartKey} className="flex gap-4 items-center border-b border-gray-100 pb-6">
                          <div className="w-20 h-20 flex-shrink-0">
                            <img 
                              src={getProductImage(item)} 
                              alt={item.name} 
                              className="w-full h-full object-contain bg-gray-50 rounded-xl"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/productos/default.png';
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="text-base font-bold text-gray-700">{item.name}</div>
                                {item.flavor && (
                                  <div className="text-sm text-gray-500">{item.flavor.name?.es || item.flavor.name || item.flavor}</div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleRemove(item);
                                }}
                                className="text-gray-400 hover:text-red-500 transition-colors duration-300 touch-manipulation"
                                title="Eliminar"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                            <div className="flex items-center border border-gray-200 rounded-lg w-max">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleQuantityChange(item, -1);
                                }}
                                className="px-3 py-1 text-[#5773BB] hover:text-[#00BFB3] transition-colors duration-300 touch-manipulation"
                                style={{ minWidth: '2.5rem' }}
                              >
                                -
                              </button>
                              <span className="px-3 py-1 border-x border-gray-200 min-w-[2.5rem] text-center">{item.quantity || 1}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleQuantityChange(item, 1);
                                }}
                                className="px-3 py-1 text-[#5773BB] hover:text-[#00BFB3] transition-colors duration-300 touch-manipulation"
                                style={{ minWidth: '2.5rem' }}
                              >
                                +
                              </button>
                            </div>
                            <span className="font-bold text-lg text-[#222]">MXN {Number(item.price).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                )}
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
                  <button type="button" className="text-[#5773BB] font-semibold ml-2 touch-manipulation">Añadir</button>
                </div>
                {/* Total general */}
                <div className="flex items-center justify-between text-xl font-bold mb-4 mt-6">
                  <span>Total <span className="text-base font-normal text-gray-500">(IVA Incluido)</span></span>
                  <span>MXN {Number(total).toFixed(2)}</span>
                </div>
                {/* Sucursales de recolección */}
                {cartItems.length > 0 && (
                  <div className="text-center text-[#5773BB] font-semibold mb-4">
                    {Object.keys(cartByBranch).length === 1
                      ? `Sucursal de recolección: ${Object.keys(cartByBranch)[0]}`
                      : 'Productos de varias sucursales'}
                  </div>
                )}
                {/* Checkout button */}
                <button
                  type="button"
                  className="w-full bg-[#00BFB3] hover:bg-[#00A89D] text-white font-bold py-4 rounded-xl text-lg transition-all touch-manipulation"
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
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