import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
  const router = useRouter();
  const { cartItems, clearCart, getCartByBranch } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('sucursal');
  const [stripeError, setStripeError] = useState('');

  // Agrupar productos por sucursal
  const cartByBranch = getCartByBranch();
  const branches = Object.keys(cartByBranch);

  // Calcular total general
  const total = cartItems.reduce((sum, item) => {
    const price = Number(item.price);
    return sum + (isNaN(price) ? 0 : price * (item.quantity || 1));
  }, 0);

  useEffect(() => {
    const { success, canceled, session_id } = router.query;

    if (success && session_id) {
      checkPaymentStatus(session_id);
    } else if (canceled) {
      toast.error('Pago cancelado');
      router.push('/cart');
    }
  }, [router.query]);

  const checkPaymentStatus = async (sessionId) => {
    try {
      const response = await fetch(`/api/get-order?session_id=${sessionId}`);
      const data = await response.json();

      if (data.status === 'paid') {
        setPaymentStatus('success');
        setOrderDetails(data);
        clearCart();
        toast.success('¡Pago exitoso!');
      } else {
        setPaymentStatus('pending');
        toast.error('Pago pendiente');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      toast.error('Error al verificar el pago');
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Por favor inicia sesión para continuar');
      router.push('/login');
      return;
    }

    if (!cartItems.length) {
      toast.error('El carrito está vacío');
      router.push('/cart');
      return;
    }

    setLoading(true);
    setStripeError('');

    try {
      if (paymentMethod === 'stripe') {
        // Validar que haya productos y precios válidos
        const cleanCartItems = cartItems.map(item => ({
          ...item,
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
          name: item.name || item.nombre || 'Producto sin nombre'
        }));

        if (cleanCartItems.length === 0) {
          setStripeError('No hay productos en el carrito');
          setLoading(false);
          return;
        }

        const invalidItems = cleanCartItems.filter(item => !item.price || item.price <= 0 || !item.quantity || item.quantity <= 0);
        if (invalidItems.length > 0) {
          setStripeError('Hay productos con precios o cantidades inválidas');
          setLoading(false);
          return;
        }

        if (!user.email) {
          setStripeError('No se encontró el email del usuario.');
          setLoading(false);
          return;
        }

        // Guardar el total en localStorage antes de redirigir a Stripe
        localStorage.setItem('lastOrderTotal', total.toString());

        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cartItems: cleanCartItems,
            email: user.email,
          }),
        });

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        if (data.url) {
          window.location.href = data.url;
        } else {
          setStripeError('No se pudo iniciar el pago con Stripe.');
        }
      } else {
        // Lógica para pago en sucursal
        // Aquí iría tu lógica para guardar el pedido en Firestore
        // y enviar el correo de confirmación
        toast.success('Pedido realizado. Te enviaremos un correo con los detalles.');
        clearCart();
        router.push('/');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  if (paymentStatus === 'success') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-green-800 mb-4">¡Pago Exitoso!</h2>
          <p className="text-green-700 mb-4">
            Gracias por tu compra. Hemos enviado un correo de confirmación a {orderDetails?.customer_email}.
          </p>
          <div className="bg-white rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-2">Detalles del pedido:</h3>
            <p>Total: ${(orderDetails?.amount_total / 100).toFixed(2)} MXN</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>
        <div className="space-y-4">
          {branches.map(branch => {
            const items = cartByBranch[branch];
            if (!items || items.length === 0) return null;
            return (
              <div key={branch} className="mb-6 border-2 border-[#5773BB] bg-[#f5f8ff] rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block w-3 h-3 rounded-full bg-[#5773BB]"></span>
                  <span className="font-bold text-[#5773BB] text-lg">Sucursal: {branch}</span>
                </div>
                {items.map((item) => (
                  <div key={item.cartKey} className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">${item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            );
          })}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center font-bold">
              <p>Total</p>
              <p>${total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Método de pago</h2>
        <div className="flex flex-col gap-3">
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00BFB3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7V6a2 2 0 012-2h14a2 2 0 012 2v1M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7M3 7h18" />
              </svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#5773BB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 7v7m0 0h4m-4 0H8" />
              </svg>
              Pagar en línea
            </span>
          </label>
        </div>
      </div>

      {stripeError && <div className="text-red-500 font-bold mb-4">{stripeError}</div>}
      
      <button
        onClick={handleCheckout}
        disabled={loading || !cartItems.length}
        className={`w-full py-3 px-6 rounded-lg text-white font-semibold ${
          loading || !cartItems.length
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#00BFB3] hover:bg-[#00A89D]'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <FaSpinner className="animate-spin mr-2" />
            Procesando...
          </span>
        ) : (
          'Finalizar pedido'
        )}
      </button>
    </div>
  );
} 