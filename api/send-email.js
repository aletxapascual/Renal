import nodemailer from 'nodemailer';

function buildReceiptEmail({ pedido, user, branchInfo, logoUrl }) {
  const productosHtml = pedido.productos.map(item => `
    <tr>
      <td style="padding:8px 4px;border-bottom:1px solid #eee;">${item.name || item.nombre}</td>
      <td style="padding:8px 4px;text-align:center;border-bottom:1px solid #eee;">${item.quantity}</td>
      <td style="padding:8px 4px;text-align:right;border-bottom:1px solid #eee;">MXN ${Number(item.price).toFixed(2)}</td>
      <td style="padding:8px 4px;text-align:right;border-bottom:1px solid #eee;">MXN ${(Number(item.price) * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');
  return `
  <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
    <div style="background:#2B4C8C;padding:24px 0;text-align:center;">
      <img src="${logoUrl}" alt="Renal" style="height:60px;margin-bottom:8px;"/>
      <h1 style="color:#fff;font-size:2rem;margin:0;">¡Gracias por tu compra!</h1>
    </div>
    <div style="padding:24px;">
      <h2 style="color:#2B4C8C;font-size:1.2rem;margin-bottom:8px;">Resumen de tu pedido</h2>
      <p style="margin:0 0 8px 0;font-size:1rem;">Pedido #: <b>${pedido.id || ''}</b></p>
      <p style="margin:0 0 8px 0;font-size:1rem;">Fecha: <b>${pedido.fecha ? new Date(pedido.fecha).toLocaleString('es-MX') : ''}</b></p>
      <p style="margin:0 0 8px 0;font-size:1rem;">Cliente: <b>${user?.firstName || user?.email || ''}</b></p>
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
        <a href="${branchInfo?.mapLink || ''}" style="color:#2B4C8C;text-decoration:underline;" target="_blank">Ver en Google Maps</a>
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

  const { pedido, user, branchInfo, logoUrl } = req.body;
  if (!pedido || !user || !branchInfo || !logoUrl) {
    return res.status(400).json({ error: 'Faltan datos para el correo' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const html = buildReceiptEmail({ pedido, user, branchInfo, logoUrl });
    const subject = `¡Gracias por tu compra en Renal! Pedido #${pedido.id || ''}`;

    // Enviar al cliente
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject,
      html,
    });
    // Enviar a gerencia
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: 'gerencia@hemodialisis.com.mx',
      subject: `[COPIA] ${subject}`,
      html,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error enviando correo:', error);
    return res.status(500).json({ error: 'Error enviando correo', details: error.message });
  }
} 