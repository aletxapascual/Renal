import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FaMicrochip, FaFlask, FaHospitalAlt } from 'react-icons/fa';
import sillonVerticalImg from '../../images/sillonVertical.png';

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
        <h2 className="font-sans text-4xl md:text-5xl font-bold text-[#5773BB] mb-12 text-center">
          ¿Qué nos distingue?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-3xl p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="bg-[#5773BB]/10 rounded-2xl p-4 w-fit mb-6">
                {feature.icon}
              </div>
              
              <h3 className="font-sans text-2xl font-bold text-[#5773BB] mb-4">
                {feature.title}
              </h3>
              
              <p className="font-sans text-gray-600 text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Container3; 