import nodemailer from 'nodemailer';

// Configurar el transporter de nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function buildReceiptEmail({ pedido, user, branchInfo, logoUrl }) {
  const productosHtml = pedido.productos.map(item => `
    <tr>
      <td style="text-align:left;padding:8px 4px;">${item.name} ${item.flavor ? `(${item.flavor.name?.es || item.flavor.name || item.flavor})` : ''}</td>
      <td style="text-align:center;padding:8px 4px;">${item.quantity}</td>
      <td style="text-align:right;padding:8px 4px;">MXN ${Number(item.price).toFixed(2)}</td>
      <td style="text-align:right;padding:8px 4px;">MXN ${(Number(item.price) * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9f9f9;">
      <div style="text-align:center;margin-bottom:20px;">
        <img src="${logoUrl}" alt="Logo" style="max-width:200px;height:auto;">
      </div>
      <div style="background:white;padding:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="color:#2B4C8C;margin-bottom:20px;text-align:center;">¡Gracias por tu compra!</h1>
        <p style="color:#666;line-height:1.6;">Hola ${user.displayName || user.email},</p>
        <p style="color:#666;line-height:1.6;">Tu pedido ha sido recibido y está siendo procesado. Aquí están los detalles:</p>
        <p style="color:#666;line-height:1.6;"><b>Número de pedido:</b> ${pedido.id}</p>
        <p style="color:#666;line-height:1.6;"><b>Fecha:</b> ${new Date(pedido.fecha).toLocaleString()}</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <thead>
            <tr style="background:#f5f8ff;">
              <th style="text-align:left;padding:8px 4px;">Producto</th>
              <th style="text-align:center;padding:8px 4px;">Cantidad</th>
              <th style="text-align:right;padding:8px 4px;">Precio</th>
              <th style="text-align:right;padding:8px 4px;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${productosHtml}
          </tbody>
        </table>
        <div style="margin:16px 0 8px 0;font-size:1.1rem;"><b>Total: MXN ${Number(pedido.total).toFixed(2)}</b></div>
        <div style="margin:8px 0;font-size:1rem;">
          <b>Método de pago:</b> ${pedido.metodoPago === 'stripe' ? 'En línea (Stripe)' : 'En sucursal'}<br/>
          <b>Estado de pago:</b> ${pedido.estado}
        </div>
        <div style="margin:8px 0;font-size:1rem;">
          <b>Lugar de recolección:</b> ${pedido.lugarRecogida}<br/>
          <b>Dirección:</b> ${branchInfo?.direccion || ''}<br/>
          <a href="${branchInfo?.map || ''}" style="color:#2B4C8C;text-decoration:underline;" target="_blank">Ver en Google Maps</a>
        </div>
        <div style="margin-top:24px;font-size:0.95rem;color:#888;">¿Dudas? Contáctanos a <a href="mailto:gerencia@hemodialisis.com.mx">gerencia@hemodialisis.com.mx</a></div>
      </div>
    </div>
  `;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { pedido, user, branchInfo, logoUrl } = req.body;

    if (!pedido || !user || !branchInfo) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailHtml = buildReceiptEmail({ pedido, user, branchInfo, logoUrl });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: `Confirmación de pedido #${pedido.id}`,
      html: emailHtml,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ 
      error: 'Error sending email',
      details: error.message
    });
  }
} 