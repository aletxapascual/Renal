import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, doc, runTransaction, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const Checkout = () => {
  const { cartItems, updateInventoryAfterPurchase, clearCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Validar que todos los productos sean de la misma sucursal
  const allSameBranch = cartItems.every(item => item.branch === cartItems[0]?.branch);
  const selectedBranch = cartItems[0]?.branch || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!allSameBranch) {
      setError('Todos los productos del carrito deben ser de la misma sucursal.');
      setIsLoading(false);
      return;
    }

    try {
      // Consecutive order ID logic
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

      // Crear el pedido con el nuevo ID
      await setDoc(doc(db, 'pedidos', newOrderId), {
        uid: user.uid,
        email: user.email,
        productos: cartItems,
        total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        estado: 'Pendiente',
        fecha: new Date().toISOString(),
        lugarRecogida: selectedBranch
      });

      // Actualizar el inventario
      await updateInventoryAfterPurchase(cartItems);

      // Limpiar el carrito
      clearCart();

      // Redirigir al usuario
      navigate('/usuario');
    } catch (err) {
      console.error(err);
      setError('Hubo un error al procesar tu pedido. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Checkout</h1>
      <div className="max-w-4xl mx-auto flex flex-wrap justify-between">
        <div className="w-full md:w-5/12 mb-6 md:mb-0 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-left">Shipping Information</h2>
          <form className="text-left">
            <div className="mb-4">
              <label htmlFor="name" className="block font-bold mb-2">Full Name</label>
              <input 
                type="text" 
                id="name" 
                placeholder="Enter your full name" 
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block font-bold mb-2">Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Enter your email" 
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="block font-bold mb-2">Address</label>
              <input 
                type="text" 
                id="address" 
                placeholder="Enter your address" 
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="city" className="block font-bold mb-2">City</label>
              <input 
                type="text" 
                id="city" 
                placeholder="Enter your city" 
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="zip" className="block font-bold mb-2">ZIP Code</label>
              <input 
                type="text" 
                id="zip" 
                placeholder="Enter your ZIP code" 
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </form>
        </div>
        <div className="w-full md:w-5/12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-left">Payment Information</h2>
          <form className="text-left">
            <div className="mb-4">
              <label htmlFor="card-number" className="block font-bold mb-2">Card Number</label>
              <input 
                type="text" 
                id="card-number" 
                placeholder="Enter card number" 
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="expiry" className="block font-bold mb-2">Expiry Date</label>
              <input 
                type="text" 
                id="expiry" 
                placeholder="MM/YY" 
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="cvv" className="block font-bold mb-2">CVV</label>
              <input 
                type="text" 
                id="cvv" 
                placeholder="Enter CVV" 
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors">
              Place Order
            </button>
          </form>
        </div>
      </div>
      {error && <div className="text-red-500 font-bold mb-4">{error}</div>}
    </div>
  );
};

export default Checkout; 