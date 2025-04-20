import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';

function Container1() {
  const { language } = useLanguage();

  return (
    <div className="relative bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-sans text-6xl font-bold mb-4 text-[#5773BB]">
            Sobre Nosotros
          </h1>

          <div className="mt-8">
            <p className="font-sans text-lg text-gray-600 leading-relaxed">
              En nuestra empresa, creemos firmemente que el cuidado renal debe ir mucho más allá de lo técnico o lo rutinario. Cada paciente es una persona con emociones, necesidades y una historia única, por lo que nos enfocamos en ofrecer una atención integral que combine tecnología confiable con una verdadera vocación de servicio. Nuestra filosofía se basa en la calidez humana, la atención personalizada y el compromiso constante con la calidad médica.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Container1; 