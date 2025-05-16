import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, doc, runTransaction, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { storeLocations } from '../containers/tienda/ProductDetail';
import { useLoginModal } from '../context/LoginModalContext';

const Checkout = () => {
  const { cartItems, updateInventoryAfterPurchase, clearCart, getCartByBranch } = useCart();
  const { user } = useAuth();
  const { openLoginModal } = useLoginModal();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('sucursal');

  // Agrupar productos por sucursal
  const cartByBranch = getCartByBranch();
  const branches = Object.keys(cartByBranch);

  // Si no hay usuario, no renderizar nada especial (permitir ver el resumen)

  // Calcular total general
  const total = cartItems.reduce((sum, item) => {
    const price = Number(item.price);
    return sum + (isNaN(price) ? 0 : price * (item.quantity || 1));
  }, 0);

  // Si no hay productos en el carrito, no permitir finalizar pedido
  const isCartEmpty = cartItems.length === 0;

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

    // Verificar que tenemos los datos necesarios del usuario
    if (!user.uid || !user.email) {
      setError('Error: No se encontraron los datos del usuario. Por favor, cierra sesión y vuelve a iniciar sesión.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      console.log('Iniciando proceso de checkout...');
      // Para cada sucursal, crea un pedido
      for (const branch of branches) {
        console.log(`Procesando pedido para sucursal: ${branch}`);
        const items = cartByBranch[branch];
        // Consecutive order ID logic
        const counterRef = doc(db, 'pedidos', 'contador');
        let newOrderId;
        try {
          await runTransaction(db, async (transaction) => {
            console.log('Iniciando transacción para contador...');
            const counterDoc = await transaction.get(counterRef);
            let current = 0;
            if (counterDoc.exists()) {
              current = counterDoc.data().value || 0;
            }
            newOrderId = (current + 1).toString();
            transaction.set(counterRef, { value: current + 1 });
          });
          console.log('Nuevo ID de pedido generado:', newOrderId);
        } catch (err) {
          console.error('Error en transacción del contador:', err);
          throw new Error('Error al generar ID de pedido');
        }

        // Nota para indicar si hay productos de varias sucursales
        let nota = '';
        if (branches.length > 1) {
          nota = 'Este pedido es parte de una compra con productos de varias sucursales. Recoge cada producto en su sucursal correspondiente.';
        }

        try {
          // Crear el pedido con el nuevo ID
          console.log('Creando pedido en Firestore...');
          const pedidoData = {
            uid: user.uid,
            email: user.email,
            productos: items,
            total: items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0),
            estado: 'Pendiente',
            fecha: new Date().toISOString(),
            lugarRecogida: branch,
            nota
          };
          console.log('Datos del pedido:', pedidoData);
          await setDoc(doc(db, 'pedidos', newOrderId), pedidoData);
          console.log('Pedido creado exitosamente');

          // Actualizar el inventario de esa sucursal
          console.log('Actualizando inventario...');
          await updateInventoryAfterPurchase(items);
          console.log('Inventario actualizado exitosamente');
        } catch (err) {
          console.error('Error al crear pedido o actualizar inventario:', err);
          throw new Error('Error al procesar el pedido');
        }
      }

      // Limpiar el carrito
      console.log('Limpiando carrito...');
      clearCart();

      // Redirigir al usuario
      setSuccess(true);
    } catch (err) {
      console.error('Error completo en checkout:', err);
      setError('Hubo un error al procesar tu pedido. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold text-green-600 mb-4">¡Pedido realizado!</h2>
        <p className="text-lg mb-8">Gracias por tu compra. Pronto recibirás un correo de confirmación.</p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-[#5773BB] hover:bg-[#405a99] text-white font-bold py-3 px-6 rounded-lg text-lg transition-all"
            onClick={() => navigate('/usuario')}
          >
            Ver mis pedidos
          </button>
          <button
            className="bg-[#00BFB3] hover:bg-[#00A89D] text-white font-bold py-3 px-6 rounded-lg text-lg transition-all"
            onClick={() => navigate('/')}
          >
            Volver a la tienda
          </button>
        </div>
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
        {paymentMethod === 'stripe' ? (
          <div className="border border-dashed border-[#5773BB] rounded-lg p-6 text-center text-[#5773BB] bg-[#f5f8ff] flex flex-col items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-[#5773BB]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 7v7m0 0h4m-4 0H8" /></svg>
            <span className="font-semibold text-lg">Paga de forma segura en línea</span>
            <span className="text-sm text-[#5773BB]">Aquí irá el formulario de pago con Stripe.</span>
          </div>
        ) : (
          <div className="border border-dashed border-[#00BFB3] rounded-lg p-6 text-center text-[#00BFB3] bg-[#e6fcfa] flex flex-col items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-[#00BFB3]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7V6a2 2 0 012-2h14a2 2 0 012 2v1M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7M3 7h18" /></svg>
            <span className="font-semibold text-lg">Paga al recoger tu pedido en la sucursal</span>
            <span className="text-sm text-[#00BFB3]">Puedes pagar en efectivo, tarjeta o transferencia al momento de la entrega.</span>
          </div>
        )}
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