import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_XXXXXXXXXXXXXXXXXXXXXXXX');

function CheckoutForm() {
  const { cartItems, clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    if (!stripe || !elements) {
      setError('Stripe no está listo.');
      setIsLoading(false);
      return;
    }

    // Simulación: en producción, deberías crear un PaymentIntent en tu backend
    // Aquí solo mostramos éxito para la demo
    setTimeout(() => {
      setSuccess(true);
      clearCart();
      setIsLoading(false);
    }, 1500);
  };

  if (success) {
    return <div className="text-center py-16">
      <h2 className="text-3xl font-bold text-green-600 mb-4">¡Pago exitoso!</h2>
      <p className="text-lg">Gracias por tu compra. Pronto recibirás un correo de confirmación.</p>
    </div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-[#5773BB]">Checkout</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Resumen del pedido</h2>
        <ul className="mb-2">
          {cartItems.map((item, idx) => (
            <li key={idx} className="flex justify-between text-gray-700 mb-1">
              <span>{item.name} {item.flavor ? `(${item.flavor.name?.es || item.flavor.name || item.flavor})` : ''} x{item.quantity}</span>
              <span>MXN {Number(item.price).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total:</span>
          <span>MXN {total.toFixed(2)}</span>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Datos de pago</h2>
        <div className="border border-gray-300 rounded-lg p-4">
          <CardElement options={{ style: { base: { fontSize: '18px' } } }} />
        </div>
      </div>
      {error && <div className="text-red-500 font-bold mb-4">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-[#00BFB3] hover:bg-[#00A89D] text-white font-bold py-3 rounded-lg text-lg transition-all disabled:opacity-50"
      >
        {isLoading ? 'Procesando...' : 'Pagar ahora'}
      </button>
    </form>
  );
}

export default function CheckoutStripe() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
} 