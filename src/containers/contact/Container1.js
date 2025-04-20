import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';

function Container1() {
  const { language } = useLanguage();

  return (
    <div className="relative bg-gradient-to-br from-white via-[#5773BB]/10 to-[#5773BB]/20 py-12">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#5773BB]/25 to-transparent blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#5773BB]/20 to-transparent blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.h1 
            className="font-sans text-6xl font-bold mb-8 text-[#5773BB]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Contáctanos
          </motion.h1>

          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-xl text-gray-600 leading-relaxed">
              Si tú o un ser querido necesitan información sobre nuestros servicios de hemodiálisis, 
              o si deseas agendar una cita, no dudes en escribirnos o llamarnos. 
              Nuestro equipo estará encantado de apoyarte.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Container1; 