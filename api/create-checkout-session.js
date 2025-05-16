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
    
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'No hay productos en el carrito' });
    }

    // Validar que cada item tenga los campos necesarios
    const validItems = cartItems.every(item => 
      item && 
      (item.name || item.nombre) && 
      typeof item.price === 'number' && 
      typeof item.quantity === 'number'
    );

    if (!validItems) {
      return res.status(400).json({ error: 'Los items del carrito no tienen el formato correcto' });
    }

    const line_items = cartItems.map(item => ({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: item.name || item.nombre || 'Producto',
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${req.headers.origin}/checkout?success=true`,
      cancel_url: `${req.headers.origin}/checkout?canceled=true`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    
    // Manejar errores específicos de Stripe
    if (error.type === 'StripeCardError') {
      return res.status(400).json({ error: 'Error con la tarjeta de crédito' });
    } else if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ error: 'Error en la solicitud a Stripe' });
    } else if (error.type === 'StripeAPIError') {
      return res.status(500).json({ error: 'Error en el servidor de Stripe' });
    }
    
    return res.status(500).json({ 
      error: 'Error al crear la sesión de Stripe',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 