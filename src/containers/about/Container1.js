import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';

function Container1() {
  const { language } = useLanguage();

  return (
    <div className="relative bg-white">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-sans max-[375px]:text-[72px] text-6xl font-bold mb-8 text-[#5773BB] max-[375px]:bg-red-500"
          >
            Sobre Nosotros
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <p className="font-sans text-lg text-gray-600 leading-relaxed text-center">
              En nuestra empresa, creemos firmemente que el cuidado renal debe ir mucho más allá de lo técnico o lo rutinario. Cada paciente es una persona con emociones, necesidades y una historia única, por lo que nos enfocamos en ofrecer una atención integral que combine tecnología confiable con una verdadera vocación de servicio. Además de ofrecer tratamientos seguros y eficaces, acompañamos a nuestros pacientes con la mirada puesta en el objetivo final: el trasplante renal y una mejor calidad de vida.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Container1; 