import Stripe from 'stripe';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Error verificando webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar el evento de pago exitoso
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      // Obtener los items del carrito desde los metadatos
      const cartItems = JSON.parse(session.metadata.cartItems);
      
      // Actualizar el inventario para cada producto
      for (const item of cartItems) {
        const productRef = doc(db, 'productos', item.id);
        const productDoc = await getDoc(productRef);
        
        if (productDoc.exists()) {
          const currentStock = productDoc.data().stock || 0;
          const newStock = Math.max(0, currentStock - (item.quantity || 1));
          await updateDoc(productRef, { stock: newStock });
        }
      }

      // Crear el pedido en Firestore
      const pedidoData = {
        uid: session.metadata.uid || '',
        email: session.customer_email,
        productos: cartItems.map(item => ({
          ...item,
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1
        })),
        total: session.amount_total / 100, // Convertir de centavos a pesos
        estado: 'Pagado',
        fecha: new Date().toISOString(),
        lugarRecogida: cartItems[0]?.branch || cartItems[0]?.sucursal || 'Sucursal desconocida',
        nota: cartItems.length > 1 ? 'Este pedido es parte de una compra con productos de varias sucursales. Recoge cada producto en su sucursal correspondiente.' : '',
        metodoPago: 'stripe',
        sessionId: session.id
      };

      // Enviar correo de confirmación
      const logoUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://renal-seven.vercel.app'}/images/logo.png`;
      const branchInfo = {
        direccion: '',
        mapLink: '',
      };

      // Determinar la información de la sucursal
      const branch = cartItems[0]?.branch || cartItems[0]?.sucursal;
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

      // Enviar correo
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://renal-seven.vercel.app'}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pedido: { ...pedidoData, id: session.id },
          user: { email: session.customer_email },
          branchInfo,
          logoUrl,
        }),
      });

      return res.status(200).json({ received: true });
    } catch (err) {
      console.error('Error procesando el pago:', err);
      return res.status(500).json({ error: 'Error procesando el pago' });
    }
  }

  return res.status(200).json({ received: true });
} 