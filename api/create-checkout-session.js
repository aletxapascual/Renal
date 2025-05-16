import Stripe from 'stripe';

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

    // Usar URL de producción en Vercel
    const origin = process.env.VERCEL_ENV === 'production' 
      ? PRODUCTION_URL 
      : (req.headers.origin || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');

    // Validar y limpiar cada item
    const validItems = cartItems.map(item => {
      // Asegurar que price y quantity sean números
      const price = Number(item.price);
      const quantity = Number(item.quantity) || 1;
      
      if (isNaN(price) || price <= 0) {
        console.error('Error: Precio inválido para el producto', item);
        throw new Error(`Precio inválido para el producto: ${item.name || 'Sin nombre'}`);
      }
      
      if (isNaN(quantity) || quantity <= 0) {
        console.error('Error: Cantidad inválida para el producto', item);
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
      success_url: `${origin}/checkout?success=true`,
      cancel_url: `${origin}/checkout?canceled=true`,
      customer_email: email, // Email del usuario
      metadata: {
        orderId: Date.now().toString(),
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