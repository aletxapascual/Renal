import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Función auxiliar para validar URLs
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Función para simplificar los items del carrito para metadata
function simplifyCartItems(items) {
  return items.map(item => ({
    id: item.id,
    name: item.name || item.nombre,
    quantity: item.quantity,
    price: item.price,
    flavor: item.flavor?.id || null,
    branch: item.branch
  }));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cartItems, email } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    if (!email) {
      return res.status(400).json({ error: 'No email provided' });
    }

    const origin = req.headers.origin || 'http://localhost:3000';

    // Crear sesión de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartItems.map(item => {
        // Validar y procesar la imagen
        let imageUrl = null;
        if (item.image) {
          // Si la imagen es una URL relativa, convertirla a absoluta
          if (item.image.startsWith('/')) {
            imageUrl = `${origin}${item.image}`;
          } else if (isValidUrl(item.image)) {
            imageUrl = item.image;
          }
        }

        return {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: item.name || item.nombre,
              images: imageUrl ? [imageUrl] : [],
            },
            unit_amount: Math.round(Number(item.price) * 100),
          },
          quantity: Number(item.quantity) || 1,
        };
      }),
      mode: 'payment',
      success_url: `${origin}/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=true`,
      customer_email: email,
      metadata: {
        cartItems: JSON.stringify(simplifyCartItems(cartItems)),
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