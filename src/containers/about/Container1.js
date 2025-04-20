import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';

function Container1() {
  const { language } = useLanguage();

  return (
    <div id="inicio" className="bg-gradient-to-b from-white to-[#5773BB]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.h1 
            className="font-sans text-6xl font-bold text-[#5773BB] mb-12 relative"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            Sobre Nosotros
            <motion.div 
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-[#5773BB] rounded-full"
              whileHover={{ width: "120px" }}
              transition={{ duration: 0.3 }}
            />
          </motion.h1>

          <motion.div 
            className="text-gray-600 text-lg mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="font-sans leading-relaxed">
              En nuestra empresa, creemos firmemente que el cuidado renal debe ir mucho más allá de lo técnico o lo rutinario. Cada paciente es una persona con emociones, necesidades y una historia única, por lo que nos enfocamos en ofrecer una atención integral que combine tecnología confiable con una verdadera vocación de servicio. Nuestra filosofía se basa en la calidez humana, la atención personalizada y el compromiso constante con la calidad médica.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Container1; 