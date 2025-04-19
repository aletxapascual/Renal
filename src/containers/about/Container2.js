import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FaUserMd, FaHospital, FaHeartbeat, FaHandHoldingMedical } from 'react-icons/fa';

function Container2() {
  const { language } = useLanguage();

  const services = [
    {
      icon: <FaUserMd className="w-16 h-16 text-[#5773BB]" />,
      title: "Atención Personalizada",
      description: "Tratamos a cada paciente de manera individual, adaptando nuestros servicios a sus necesidades específicas."
    },
    {
      icon: <FaHospital className="w-16 h-16 text-[#5773BB]" />,
      title: "Instalaciones Modernas",
      description: "Contamos con espacios diseñados para maximizar tu comodidad durante el tratamiento."
    },
    {
      icon: <FaHeartbeat className="w-16 h-16 text-[#5773BB]" />,
      title: "Cuidado Integral",
      description: "Nos enfocamos tanto en tu bienestar físico como emocional durante todo el proceso."
    },
    {
      icon: <FaHandHoldingMedical className="w-16 h-16 text-[#5773BB]" />,
      title: "Apoyo Continuo",
      description: "Estamos contigo en cada paso del camino, brindando el soporte que necesitas."
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission and Vision Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Mission Section */}
          <div>
            <h2 className="font-sans text-4xl font-bold text-[#5773BB] mb-6">
              Misión
            </h2>
            <p className="font-sans text-lg text-gray-600">
              Brindar atención nefrológica de excelencia que combine tecnología de vanguardia con un trato humano, empático y personalizado, mejorando la calidad de vida de cada uno de nuestros pacientes.
            </p>
          </div>

          {/* Vision Section */}
          <div>
            <h2 className="font-sans text-4xl font-bold text-[#5773BB] mb-6">
              Visión
            </h2>
            <p className="font-sans text-lg text-gray-600">
              Ser el centro de hemodiálisis líder en la Península de Yucatán, reconocido por su innovación tecnológica, calidez humana y compromiso con el bienestar integral de nuestros pacientes.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {services.map((service, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="bg-[#5773BB]/10 rounded-full p-6 mb-6">
                {service.icon}
              </div>
              <h3 className="font-sans text-2xl font-bold text-[#5773BB] mb-4">
                {service.title}
              </h3>
              <p className="font-sans text-gray-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Container2; 