import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cartItems } = req.body;
    
    // Validación inicial
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'No hay productos en el carrito' });
    }

    // Validar y limpiar cada item
    const validItems = cartItems.map(item => {
      // Asegurar que price y quantity sean números
      const price = Number(item.price);
      const quantity = Number(item.quantity) || 1;
      
      if (isNaN(price) || price <= 0) {
        throw new Error(`Precio inválido para el producto: ${item.name || 'Sin nombre'}`);
      }
      
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error(`Cantidad inválida para el producto: ${item.name || 'Sin nombre'}`);
      }

      return {
        price_data: {
          currency: 'mxn',
          product_data: {
            name: item.name || item.nombre || 'Producto',
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(price * 100), // Convertir a centavos
        },
        quantity: quantity,
      };
    });

    // Crear la sesión de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: validItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/checkout?success=true`,
      cancel_url: `${req.headers.origin}/checkout?canceled=true`,
      customer_email: req.body.email, // Opcional: si tienes el email del usuario
      metadata: {
        orderId: Date.now().toString(), // Opcional: para tracking
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error en create-checkout-session:', error);
    return res.status(400).json({ 
      error: error.message || 'Error al procesar el pago',
      details: error.type === 'StripeCardError' ? error.message : undefined
    });
  }
} 