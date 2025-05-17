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

      // Convertir imagen relativa a absoluta
      let imageUrl = '';
      if (item.image) {
        if (item.image.startsWith('http')) {
          imageUrl = item.image;
        } else if (item.image.startsWith('/')) {
          imageUrl = origin + item.image;
        }
      }

      return {
        price_data: {
          currency: 'mxn',
          product_data: {
            name: item.name || item.nombre || 'Producto',
            images: imageUrl ? [imageUrl] : [],
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

    // Agrupar productos por sucursal
    const cartByBranch = {};
    for (const item of cartItems) {
      const branch = item.branch || item.sucursal || item.lugarRecogida || 'Sucursal desconocida';
      if (!cartByBranch[branch]) cartByBranch[branch] = [];
      cartByBranch[branch].push(item);
    }
    const branches = Object.keys(cartByBranch);
    // Crear pedidos por sucursal
    for (const branch of branches) {
      const items = cartByBranch[branch];
      // Calcular el total para esta sucursal
      const branchTotal = items.reduce((sum, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;
        return sum + (price * quantity);
      }, 0);
      let newOrderId;
      // Guardar en Firestore (simulado, reemplaza por tu lógica real)
      // Aquí deberías usar Firestore Admin SDK o tu método para obtener el ID
      // Por ahora, usamos timestamp como ID único
      newOrderId = Date.now().toString() + Math.floor(Math.random()*1000);
      const pedidoData = {
        uid: req.body.uid || '',
        email,
        productos: items.map(item => ({
          ...item,
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1
        })),
        total: branchTotal,
        estado: 'Pagado',
        fecha: new Date().toISOString(),
        lugarRecogida: branch,
        nota: branches.length > 1 ? 'Este pedido es parte de una compra con productos de varias sucursales. Recoge cada producto en su sucursal correspondiente.' : '',
        metodoPago: 'stripe',
      };
      // Enviar correo usando pedidoData y newOrderId
      const logoUrl = `${origin}/images/logo.png`;
      const branchInfo = {
        direccion: '',
        mapLink: '',
      };
      switch (branch) {
        case 'Renal - Hemodiálisis Clínica de Riñón y trasplante renal':
        case 'Renal Clínica':
          branchInfo.direccion = 'Calle 26 No.202 Int. 5, 6 Y 7 Plaza las Brisas, 97130 Mérida, Yuc.';
          branchInfo.mapLink = 'https://maps.app.goo.gl/2E34iFDPZAcjeunK7';
          break;
        case 'Star Médica, Col. Altabrisa':
          branchInfo.direccion = 'Calle 20 No. 123, Col. Altabrisa, 97130 Mérida, Yuc.';
          branchInfo.mapLink = 'https://maps.app.goo.gl/LNsgyq1MFATmL63n7';
          break;
        case 'Cenit Medical Center':
          branchInfo.direccion = 'Calle 32 No. 456, Col. Montecristo, 97133 Mérida, Yuc.';
          branchInfo.mapLink = 'https://maps.app.goo.gl/FJqUaPfP4omkxxs6A';
          break;
      }
      try {
        await fetch(`${origin}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pedido: { ...pedidoData, id: newOrderId },
            user: { email },
            branchInfo,
            logoUrl,
          }),
        });
      } catch (err) {
        console.error('Error llamando a /api/send-email:', err);
      }
    }

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error en create-checkout-session:', error);
    return res.status(400).json({ 
      error: error.message || 'Error al procesar el pago',
      details: error.type === 'StripeCardError' ? error.message : undefined
    });
  }
} 