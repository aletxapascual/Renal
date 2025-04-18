import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FaUserMd, FaHospital, FaHeartbeat, FaHandHoldingMedical } from 'react-icons/fa';

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
    <div className="relative bg-gradient-to-br from-[#5773BB]/5 to-white overflow-hidden py-24">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#5773BB]/5 blur-3xl" />
        <div className="absolute bottom-20 -right-40 w-[400px] h-[400px] rounded-full bg-[#5773BB]/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-[#5773BB] text-5xl font-bold mb-6">
            Nuestra visión
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-8">
            Tratamos a quienes viven con insuficiencia renal como lo que son: personas con historias, rutinas, familias y sueños. Por eso, en lugar de enfocarnos solo en la enfermedad, diseñamos un espacio que facilite el tratamiento sin alterar la vida cotidiana del paciente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  {service.icon}
                </div>
                <h3 className="text-[#5773BB] text-xl font-semibold mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Container2; 