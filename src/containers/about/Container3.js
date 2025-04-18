import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FaMicrochip, FaFlask, FaHospitalAlt } from 'react-icons/fa';
import recepcionImg from '../../images/repcepcion.png';

function Container3() {
  const { language } = useLanguage();

  const features = [
    {
      icon: <FaMicrochip className="w-8 h-8 text-[#5773BB]" />,
      title: "Tecnología Alemana de Última Generación",
      description: "Contamos con equipos Fresenius Medical Care importados de Alemania, reconocidos mundialmente por su precisión y confiabilidad. Estos equipos permiten una ultrafiltración controlada, lo que asegura tratamientos más seguros y personalizados, minimizando efectos secundarios y optimizando los resultados de cada sesión."
    },
    {
      icon: <FaFlask className="w-8 h-8 text-[#5773BB]" />,
      title: "Consumibles Biocompatibles",
      description: "Utilizamos insumos desechables de alta calidad, también de la marca Fresenius, diseñados para minimizar la irritación y mejorar la tolerancia del paciente. Cada detalle de nuestro proceso está cuidadosamente seleccionado para garantizar la máxima seguridad y comodidad."
    },
    {
      icon: <FaHospitalAlt className="w-8 h-8 text-[#5773BB]" />,
      title: "Calidad Médica sin Ambiente Hospitalario",
      description: "Nos diferenciamos al romper el esquema tradicional. En lugar de ser un hospital, ofrecemos un centro especializado en hemodiálisis, donde cada elemento —desde los equipos médicos hasta el diseño del espacio— está pensado para que tu experiencia sea cómoda y eficiente, sin el estrés y la frialdad de un ambiente hospitalario."
    }
  ];

  return (
    <div className="relative bg-white overflow-hidden py-24">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
              <img
                src={recepcionImg}
                alt="Nuestras instalaciones"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#5773BB]/5 rounded-3xl -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#5773BB]/5 rounded-3xl -z-10" />
          </div>

          {/* Right Content */}
          <div>
            <h2 className="text-[#5773BB] text-4xl font-bold mb-8">
              ¿Qué nos distingue?
            </h2>

            <div className="space-y-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 bg-[#5773BB]/10 rounded-2xl p-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-[#5773BB] text-xl font-semibold">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-base leading-relaxed pl-20">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Container3; 