import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FaHeart, FaLaptopMedical, FaUserMd } from 'react-icons/fa';

function Container1() {
  const { language } = useLanguage();

  const values = [
    {
      icon: FaHeart,
      title: 'Calidez Humana',
      description: 'Cuidamos de nuestros pacientes con empatía y dedicación.'
    },
    {
      icon: FaLaptopMedical,
      title: 'Tecnología Avanzada',
      description: 'Utilizamos equipos de última generación para garantizar los mejores resultados.'
    },
    {
      icon: FaUserMd,
      title: 'Atención Personalizada',
      description: 'Cada paciente recibe un tratamiento adaptado a sus necesidades específicas.'
    }
  ];

  return (
    <div id="inicio" className="bg-gradient-to-b from-white to-[#5773BB]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-sans text-6xl font-bold text-[#5773BB] mb-8 relative">
            Sobre Nosotros
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-[#5773BB] rounded-full" />
          </h1>

          <div className="text-gray-600 text-lg mb-12">
            <p className="font-sans leading-relaxed">
              En nuestra empresa, creemos firmemente que el cuidado renal debe ir mucho más allá de lo técnico o lo rutinario. Cada paciente es una persona con emociones, necesidades y una historia única, por lo que nos enfocamos en ofrecer una atención integral que combine tecnología confiable con una verdadera vocación de servicio. Nuestra filosofía se basa en la calidez humana, la atención personalizada y el compromiso constante con la calidad médica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {values.map((value, index) => (
              <div
                key={index}
                className="relative bg-white rounded-xl p-6 shadow-lg select-none pointer-events-none"
              >
                <div className="relative z-10">
                  <div className="mb-4">
                    <value.icon className="w-12 h-12 mx-auto text-[#5773BB]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Container1; 