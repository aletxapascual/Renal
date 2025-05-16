import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { cartItems } = req.body;
  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: 'No hay productos en el carrito' });
  }
  try {
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
    return res.status(500).json({ error: 'Error al crear la sesión de Stripe' });
  }
} 