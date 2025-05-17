import Stripe from 'stripe';
import fetch from 'node-fetch';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// URL base para producción
const PRODUCTION_URL = 'https://renal-seven.vercel.app';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cartItems, email } = req.body;
    
    // Validación inicial
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      console.error('Error: No hay productos en el carrito');
      return res.status(400).json({ error: 'No hay productos en el carrito' });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      console.error('Error: Email inválido o ausente');
      return res.status(400).json({ error: 'No se encontró un email válido para el usuario' });
    }

    // Forzar origin válido
    let origin = 'http://localhost:3000';
    if (process.env.VERCEL_ENV === 'production') {
      origin = PRODUCTION_URL;
    } else if (req.headers.origin && req.headers.origin.startsWith('http')) {
      origin = req.headers.origin;
    } else if (process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL.startsWith('http')) {
      origin = process.env.NEXT_PUBLIC_BASE_URL;
    }

    // Crear sesión de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartItems.map(item => ({
        price_data: {
          currency: 'mxn',
          product_data: {
            name: item.name || item.nombre,
            description: item.description || '',
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: Number(item.quantity) || 1,
      })),
      mode: 'payment',
      success_url: `${origin}/checkout?success=true`,
      cancel_url: `${origin}/checkout?canceled=true`,
      customer_email: email,
      metadata: {
        cartItems: JSON.stringify(cartItems),
        email: email,
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