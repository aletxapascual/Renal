import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FaUserMd, FaHospital, FaHeartbeat, FaHandHoldingMedical } from 'react-icons/fa';
import sillonVerticalImg from '../../images/sillonVertical.png';

function Container2() {
  const { language } = useLanguage();

  const services = [
    {
      icon: <FaUserMd className="w-12 h-12 text-[#5773BB]" />,
      title: "Atención Personalizada",
      description: "Tratamos a cada paciente de manera individual, adaptando nuestros servicios a sus necesidades específicas."
    },
    {
      icon: <FaHospital className="w-12 h-12 text-[#5773BB]" />,
      title: "Instalaciones Modernas",
      description: "Contamos con espacios diseñados para maximizar tu comodidad durante el tratamiento."
    },
    {
      icon: <FaHeartbeat className="w-12 h-12 text-[#5773BB]" />,
      title: "Cuidado Integral",
      description: "Nos enfocamos tanto en tu bienestar físico como emocional durante todo el proceso."
    },
    {
      icon: <FaHandHoldingMedical className="w-12 h-12 text-[#5773BB]" />,
      title: "Apoyo Continuo",
      description: "Estamos contigo en cada paso del camino, brindando el soporte que necesitas."
    }
  ];

  return (
    <div className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-sans text-4xl md:text-5xl font-bold text-[#5773BB] mb-8">
            Nuestros Servicios
          </h2>
          <p className="font-sans text-lg text-gray-600 max-w-3xl mx-auto">
            En RENALSTAR PENINSULAR, nos dedicamos a proporcionar servicios de hemodiálisis de la más alta calidad, combinando tecnología avanzada con un equipo humano altamente capacitado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col items-center text-center space-y-4">
                {service.icon}
                <h3 className="font-sans text-xl font-bold text-[#5773BB]">{service.title}</h3>
                <p className="font-sans text-gray-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Container2; 