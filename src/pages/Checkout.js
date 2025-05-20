import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { addDoc, collection, doc, runTransaction, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { storeLocations } from '../containers/tienda/ProductDetail';
import { useLoginModal } from '../context/LoginModalContext';

const Checkout = () => {
  const { cartItems, updateInventoryAfterPurchase, clearCart, getCartByBranch } = useCart();
  const { user } = useAuth();
  const { openLoginModal } = useLoginModal();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('sucursal');
  const [stripeError, setStripeError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'canceled', null
  const [orderTotal, setOrderTotal] = useState(0); // Nuevo estado para guardar el total

  // Agrupar productos por sucursal
  const cartByBranch = getCartByBranch();
  const branches = Object.keys(cartByBranch);

  // Calcular total general
  const total = cartItems.reduce((sum, item) => {
    const price = Number(item.price);
    return sum + (isNaN(price) ? 0 : price * (item.quantity || 1));
  }, 0);

  // Si no hay productos en el carrito, no permitir finalizar pedido
  const isCartEmpty = cartItems.length === 0;

  // Detectar regreso de Stripe
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('success')) {
      // Leer el total guardado en localStorage (Stripe) inmediatamente
      let lastOrderTotal = localStorage.getItem('lastOrderTotal');
      if (lastOrderTotal) {
        setOrderTotal(Number(lastOrderTotal));
      } else {
        // Fallback: intentar calcular el total a partir de los productos del pedido
        let totalFromPedido = 0;
        Object.values(cartByBranch).forEach(items => {
          if (Array.isArray(items)) {
            totalFromPedido += items.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
          }
        });
        setOrderTotal(totalFromPedido);
      }
      setPaymentStatus('success');
      setSuccess(true);
    } else if (params.get('canceled')) {
      setPaymentStatus('canceled');
    }
  }, [location.search, cartByBranch]);

  // Limpiar carrito y localStorage solo después de mostrar el recibo de éxito
  useEffect(() => {
    if (paymentStatus === 'success' && success) {
      // No limpiar el carrito automáticamente
      // Solo limpiar cuando el usuario haga clic en uno de los botones
      return;
    }
  }, [paymentStatus, success]);

  // Al iniciar el checkout, limpiar recibo viejo si el carrito tiene productos (nueva compra)
  useEffect(() => {
    if (cartItems.length > 0 && !success) {
      localStorage.removeItem('lastReceipt');
    }
  }, [cartItems, success]);

  // Helper para generar el HTML del recibo
  function buildReceiptEmail({ pedido, user, branchInfo, logoUrl }) {
    const productosHtml = pedido.productos.map(item => `
      <tr>
        <td style="padding:8px 4px;border-bottom:1px solid #eee;">${item.name || item.nombre}</td>
        <td style="padding:8px 4px;text-align:center;border-bottom:1px solid #eee;">${item.quantity}</td>
        <td style="padding:8px 4px;text-align:right;border-bottom:1px solid #eee;">MXN ${Number(item.price).toFixed(2)}</td>
        <td style="padding:8px 4px;text-align:right;border-bottom:1px solid #eee;">MXN ${(Number(item.price) * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');
    return `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <div style="background:#2B4C8C;padding:24px 0;text-align:center;">
        <img src="${logoUrl}" alt="Renal" style="height:60px;margin-bottom:8px;"/>
        <h1 style="color:#fff;font-size:2rem;margin:0;">¡Gracias por tu compra!</h1>
      </div>
      <div style="padding:24px;">
        <h2 style="color:#2B4C8C;font-size:1.2rem;margin-bottom:8px;">Resumen de tu pedido</h2>
        <p style="margin:0 0 8px 0;font-size:1rem;">Pedido #: <b>${pedido.id || ''}</b></p>
        <p style="margin:0 0 8px 0;font-size:1rem;">Fecha: <b>${pedido.fecha ? new Date(pedido.fecha).toLocaleString('es-MX') : ''}</b></p>
        <p style="margin:0 0 8px 0;font-size:1rem;">Cliente: <b>${user?.firstName || user?.email || ''}</b></p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <thead>
            <tr style="background:#f5f8ff;">
              <th style="text-align:left;padding:8px 4px;">Producto</th>
              <th style="text-align:center;padding:8px 4px;">Cantidad</th>
              <th style="text-align:right;padding:8px 4px;">Precio</th>
              <th style="text-align:right;padding:8px 4px;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${productosHtml}
          </tbody>
        </table>
        <div style="margin:16px 0 8px 0;font-size:1.1rem;"><b>Total: MXN ${Number(pedido.total).toFixed(2)}</b></div>
        <div style="margin:8px 0;font-size:1rem;">
          <b>Método de pago:</b> ${pedido.metodoPago === 'stripe' ? 'En línea (Stripe)' : 'En sucursal'}<br/>
          <b>Estado de pago:</b> ${pedido.estado}
        </div>
        <div style="margin:8px 0;font-size:1rem;">
          <b>Lugar de recolección:</b> ${pedido.lugarRecogida}<br/>
          <b>Dirección:</b> ${branchInfo?.direccion || ''}<br/>
          <a href="${branchInfo?.map || ''}" style="color:#2B4C8C;text-decoration:underline;" target="_blank">Ver en Google Maps</a>
        </div>
        <div style="margin-top:24px;font-size:0.95rem;color:#888;">¿Dudas? Contáctanos a <a href="mailto:gerencia@hemodialisis.com.mx">gerencia@hemodialisis.com.mx</a></div>
      </div>
    </div>
    `;
  }

  // Helper para obtener info de sucursal
  const branchInfoMap = {
    'Renal - Hemodiálisis Clínica de Riñón y trasplante renal': {
      direccion: 'Calle 26 No.202 Int. 5, 6 Y 7 Plaza las Brisas, 97130 Mérida, Yuc.',
      map: 'https://maps.app.goo.gl/2E34iFDPZAcjeunK7',
    },
    'Renal Clínica': {
      direccion: 'Calle 26 No.202 Int. 5, 6 Y 7 Plaza las Brisas, 97130 Mérida, Yuc.',
      map: 'https://maps.app.goo.gl/2E34iFDPZAcjeunK7',
    },
    'Star Médica, Col. Altabrisa': {
      direccion: 'Calle 20 No. 123, Col. Altabrisa, 97130 Mérida, Yuc.',
      map: 'https://maps.app.goo.gl/LNsgyq1MFATmL63n7',
    },
    'Cenit Medical Center': {
      direccion: 'Calle 32 No. 456, Col. Montecristo, 97133 Mérida, Yuc.',
      map: 'https://maps.app.goo.gl/FJqUaPfP4omkxxs6A',
    },
  };

  // Guardar recibo completo antes de limpiar el carrito
  function saveReceiptToLocal(pedido, user, branchInfo, logoUrl) {
    const receipt = {
      pedido,
      user,
      branchInfo,
      logoUrl,
      fecha: new Date().toISOString(),
    };
    localStorage.setItem('lastReceipt', JSON.stringify(receipt));
  }

  // Flujo de finalizar pedido
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isCartEmpty) {
      setError('No hay productos en el carrito para comprar.');
      return;
    }
    if (!user) {
      openLoginModal();
      return;
    }
    if (!user.uid || !user.email) {
      setError('Error: No se encontraron los datos del usuario. Por favor, cierra sesión y vuelve a iniciar sesión.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccess(false);

    // Limpiar y validar los datos del carrito
    const cleanCartItems = cartItems.map(item => ({
      ...item,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      name: item.name || item.nombre || 'Producto sin nombre'
    }));

    try {
      if (paymentMethod === 'stripe') {
        // Validar que haya productos y precios válidos
        if (cleanCartItems.length === 0) {
          setStripeError('No hay productos en el carrito');
          setIsLoading(false);
          return;
        }

        const invalidItems = cleanCartItems.filter(item => !item.price || item.price <= 0 || !item.quantity || item.quantity <= 0);
        if (invalidItems.length > 0) {
          setStripeError('Hay productos con precios o cantidades inválidas');
          setIsLoading(false);
          return;
        }

        if (!user.email) {
          setStripeError('No se encontró el email del usuario.');
          setIsLoading(false);
          return;
        }

        // Guardar el total en localStorage antes de redirigir a Stripe
        localStorage.setItem('lastOrderTotal', total.toString());

        // Redirigir a Stripe Checkout
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            cartItems: cleanCartItems,
            email: user.email // Enviar el email del usuario
          }),
        });

        if (!response.ok) {
          let errorData = {};
          try { errorData = await response.json(); } catch {}
          setStripeError(errorData.error || 'Error al procesar el pago');
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        } else {
          setStripeError('No se pudo iniciar el pago con Stripe.');
          setIsLoading(false);
          return;
        }
      }

      // Pago en sucursal: flujo normal
      for (const branch of branches) {
        const items = cartByBranch[branch];
        if (!items || items.length === 0) continue;

        const counterRef = doc(db, 'pedidos', 'contador');
        let newOrderId;
        await runTransaction(db, async (transaction) => {
          const counterDoc = await transaction.get(counterRef);
          let current = 0;
          if (counterDoc.exists()) {
            current = counterDoc.data().value || 0;
          }
          newOrderId = (current + 1).toString();
          transaction.set(counterRef, { value: current + 1 });
        });

        // Actualizar el stock antes de crear el pedido
        for (const item of items) {
          const inventarioRef = doc(db, 'inventario', branch);
          const inventarioSnap = await getDoc(inventarioRef);
          if (inventarioSnap.exists()) {
            const inventario = inventarioSnap.data();
            const productStock = inventario[item.id] || { stock: 0 };
            
            if (item.flavor?.id) {
              // Actualizar stock de sabor específico
              const flavors = productStock.flavors || {};
              const currentStock = flavors[item.flavor.id] || 0;
              const newStock = Math.max(0, currentStock - item.quantity);
              
              await updateDoc(inventarioRef, {
                [item.id]: {
                  ...productStock,
                  flavors: {
                    ...flavors,
                    [item.flavor.id]: newStock
                  }
                }
              });
            } else {
              // Actualizar stock general
              const currentStock = productStock.stock || 0;
              const newStock = Math.max(0, currentStock - item.quantity);
              
              await updateDoc(inventarioRef, {
                [item.id]: {
                  ...productStock,
                  stock: newStock
                }
              });
            }
          }
        }

        let nota = '';
        if (branches.length > 1) {
          nota = 'Este pedido es parte de una compra con productos de varias sucursales. Recoge cada producto en su sucursal correspondiente.';
        }

        // Calcular el total para esta sucursal
        const branchTotal = items.reduce((sum, item) => {
          const price = Number(item.price) || 0;
          const quantity = Number(item.quantity) || 1;
          return sum + (price * quantity);
        }, 0);

        const pedidoData = {
          uid: user.uid,
          email: user.email,
          productos: items.map(item => ({
            ...item,
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 1
          })),
          total: branchTotal,
          estado: 'Pendiente',
          fecha: new Date().toISOString(),
          lugarRecogida: branch,
          nota,
          metodoPago: 'sucursal',
        };

        await setDoc(doc(db, 'pedidos', newOrderId), pedidoData);
        await updateInventoryAfterPurchase(items);

        // Enviar correo:
        const logoUrl = window.location.origin + '/images/logo.png';
        const branchInfo = branchInfoMap[branch] || {};
        
        // Enviar correo desde el backend
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pedido: { ...pedidoData, id: newOrderId },
            user,
            branchInfo,
            logoUrl,
          }),
        });

        // Guardar el recibo completo en localStorage
        saveReceiptToLocal({ ...pedidoData, id: newOrderId }, user, branchInfo, logoUrl);
      }

      // Guardar el total antes de limpiar el carrito
      setOrderTotal(total);
      setSuccess(true);
    } catch (err) {
      console.error('Error en checkout:', err);
      setError(err.message || 'Hubo un error al procesar tu pedido. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Recibo bonito después de Stripe o compra en sucursal
  let receipt = null;
  try {
    receipt = JSON.parse(localStorage.getItem('lastReceipt'));
  } catch {}

  if ((paymentStatus === 'success' || success) && (receipt || cartItems.length > 0)) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4">¡Pedido realizado!</h2>
        <p className="text-lg mb-8">Gracias por tu compra. Pronto recibirás un correo de confirmación.</p>
        <div className="mb-8">
          <h3 className="text-xl font-bold text-[#5773BB] mb-4">Resumen de tu pedido</h3>
          {branches.map(branch => {
            const items = cartByBranch[branch];
            if (!items || items.length === 0) return null;
            return (
              <div key={branch} className="mb-6 border-2 border-[#5773BB] bg-[#f5f8ff] rounded-xl shadow-sm p-4 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block w-3 h-3 rounded-full bg-[#5773BB]"></span>
                  <span className="font-bold text-[#5773BB] text-lg">Sucursal: {branch}</span>
                </div>
                <div className="mb-2">
                  {items.map((item, idx) => (
                    <div key={item.cartKey || idx} className="flex items-center justify-between text-gray-700 mb-1 gap-2 border-b border-gray-200 pb-1 last:border-b-0 last:pb-0">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded-lg bg-gray-50 mr-2" />
                      <span className="flex-1">{item.name} {item.flavor ? `(${item.flavor.name?.es || item.flavor.name || item.flavor})` : ''} x{item.quantity}</span>
                      <span>MXN {Number(item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <h3 className="text-md font-semibold mb-1 text-[#5773BB]">Datos de recolección</h3>
                  <div className="mb-2 font-medium text-[#5773BB]">Sucursal: {branch}</div>
                </div>
              </div>
            );
          })}
          <div className="flex justify-between font-bold text-lg border-t pt-2 mt-4">
            <span>Total:</span>
            <span>MXN {orderTotal.toFixed(2)}</span>
          </div>
          <div className="mt-4">
            <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
              Estado de pago: Pagado
            </span>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <button
            className="bg-[#5773BB] hover:bg-[#405a99] text-white font-bold py-3 px-6 rounded-lg text-lg transition-all"
            onClick={() => {
              localStorage.removeItem('lastReceipt');
              clearCart();
              navigate('/usuario');
            }}
          >
            Ver mis pedidos
          </button>
          <button
            className="bg-[#00BFB3] hover:bg-[#00A89D] text-white font-bold py-3 px-6 rounded-lg text-lg transition-all"
            onClick={() => {
              localStorage.removeItem('lastReceipt');
              clearCart();
              navigate('/');
            }}
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'canceled') {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 text-center">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Pago cancelado</h2>
        <p className="text-lg mb-8">El pago fue cancelado. Puedes intentar de nuevo o elegir otro método de pago.</p>
        <button
          className="bg-[#5773BB] hover:bg-[#405a99] text-white font-bold py-3 px-6 rounded-lg text-lg transition-all"
          onClick={() => navigate('/checkout')}
        >
          Volver al checkout
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-[#5773BB]">Checkout</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Resumen del pedido</h2>
        {branches.length === 0 ? (
          <div className="text-gray-500">No hay productos en el carrito.</div>
        ) : (
          branches.map(branch => {
            const items = cartByBranch[branch];
            const selectedLocation = storeLocations.find(loc => loc.name === branch);
            return (
              <div key={branch} className="mb-8 border-2 border-[#5773BB] bg-[#f5f8ff] rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block w-3 h-3 rounded-full bg-[#5773BB]"></span>
                  <span className="font-bold text-[#5773BB] text-lg">Sucursal: {branch}</span>
                </div>
                <div className="mb-2">
                  {items.map((item, idx) => (
                    <div key={item.cartKey || idx} className="flex items-center justify-between text-gray-700 mb-1 gap-2 border-b border-gray-200 pb-1 last:border-b-0 last:pb-0">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded-lg bg-gray-50 mr-2" />
                      <span className="flex-1">{item.name} {item.flavor ? `(${item.flavor.name?.es || item.flavor.name || item.flavor})` : ''} x{item.quantity}</span>
                      <span>MXN {Number(item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <h3 className="text-md font-semibold mb-1 text-[#5773BB]">Datos de recolección</h3>
                  <div className="mb-2 font-medium text-[#5773BB]">Sucursal: {branch}</div>
                  {selectedLocation && (
                    <div className="mb-4 w-full flex justify-center">
                      <iframe
                        src={selectedLocation.map}
                        width="100%"
                        height="200"
                        style={{ border: 0, borderRadius: '12px', minHeight: '150px' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Mapa de ${branch}`}
                        className="w-full max-w-xl"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-4">
          <span>Total:</span>
          <span>MXN {total.toFixed(2)}</span>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Pago</h2>
        <div className="flex flex-col gap-3 mb-4">
          <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-[#00BFB3] transition-all duration-200 shadow-sm bg-white">
            <input
              type="radio"
              name="paymentMethod"
              value="sucursal"
              checked={paymentMethod === 'sucursal'}
              onChange={() => setPaymentMethod('sucursal')}
              className="accent-[#00BFB3]"
            />
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00BFB3]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7V6a2 2 0 012-2h14a2 2 0 012 2v1M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7M3 7h18" /></svg>
              Pagar en sucursal
            </span>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-[#5773BB] transition-all duration-200 shadow-sm bg-white">
            <input
              type="radio"
              name="paymentMethod"
              value="stripe"
              checked={paymentMethod === 'stripe'}
              onChange={() => setPaymentMethod('stripe')}
              className="accent-[#5773BB]"
            />
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#5773BB]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 7v7m0 0h4m-4 0H8" /></svg>
              Pagar en línea
            </span>
          </label>
        </div>
        {stripeError && paymentMethod === 'stripe' && <div className="text-red-600 text-center font-semibold mt-2">{stripeError}</div>}
      </div>
      {error && <div className="text-red-500 font-bold mb-4">{error}</div>}
      <button
        type={user ? 'submit' : 'button'}
        disabled={isLoading || isCartEmpty}
        className="w-full bg-[#00BFB3] hover:bg-[#00A89D] text-white font-bold py-3 rounded-lg text-lg transition-all disabled:opacity-50"
        onClick={!user ? openLoginModal : undefined}
      >
        {user ? (isLoading ? 'Procesando...' : 'Finalizar pedido') : 'Inicia sesión para finalizar tu compra'}
      </button>
    </form>
  );
};

export default Checkout; 