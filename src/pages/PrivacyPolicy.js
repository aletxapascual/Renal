import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">Política de Privacidad</h1>
      
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Información que Recopilamos</h2>
          <p>Recopilamos información que usted nos proporciona directamente cuando:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Se registra en nuestra plataforma</li>
            <li>Realiza una compra</li>
            <li>Se comunica con nosotros</li>
            <li>Utiliza nuestros servicios</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Uso de la Información</h2>
          <p>Utilizamos la información recopilada para:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Procesar sus pedidos y pagos</li>
            <li>Comunicarnos con usted sobre su cuenta o pedidos</li>
            <li>Enviarle información sobre nuestros productos y servicios</li>
            <li>Mejorar nuestros servicios</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Protección de Datos</h2>
          <p>Protegemos su información personal mediante:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Encriptación de datos sensibles</li>
            <li>Acceso restringido a la información personal</li>
            <li>Monitoreo regular de nuestros sistemas</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Cookies y Tecnologías Similares</h2>
          <p>Utilizamos cookies y tecnologías similares para:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Mejorar su experiencia de navegación</li>
            <li>Recordar sus preferencias</li>
            <li>Analizar el uso de nuestro sitio</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Sus Derechos</h2>
          <p>Usted tiene derecho a:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Acceder a su información personal</li>
            <li>Corregir información inexacta</li>
            <li>Solicitar la eliminación de sus datos</li>
            <li>Oponerse al procesamiento de sus datos</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Contacto</h2>
          <p>Si tiene preguntas sobre nuestra política de privacidad, puede contactarnos en:</p>
          <p className="mt-2">Email: gerencia@hemodialisis.com.mx</p>
          <p>Teléfono: (999) 930 6925</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Cambios en la Política</h2>
          <p>Nos reservamos el derecho de modificar esta política de privacidad en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio.</p>
        </section>

        <div className="mt-8 text-sm text-gray-500">
          <p>Última actualización: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 