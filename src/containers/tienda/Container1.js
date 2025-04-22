import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

function Container1() {
  const { language } = useLanguage();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <section className="relative min-h-[90vh] bg-gradient-to-br from-[#5773BB]/10 via-white to-[#5773BB]/5 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-40 right-40 w-[500px] h-[500px] bg-gradient-to-br from-[#5773BB]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-gradient-to-tr from-[#00BFB3]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-20 left-1/2 w-[300px] h-[300px] bg-gradient-to-br from-[#00BFB3]/10 to-transparent rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h1 className="text-5xl sm:text-6xl font-bold text-[#5773BB] leading-tight">
              {language === 'es' 
                ? 'Apoyo Nutricional Especializado' 
                : 'Specialized Nutritional Support'}
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
              {language === 'es'
                ? 'Ofrecemos suplementos que complementan la hemodiálisis, ayudando a mejorar la salud intestinal, fortalecer el sistema inmune y mantener el equilibrio metabólico en pacientes con insuficiencia renal.'
                : 'We offer supplements that complement hemodialysis, helping to improve intestinal health, strengthen the immune system, and maintain metabolic balance in patients with renal insufficiency.'}
            </p>
          </motion.div>

          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center items-center lg:-mr-20"
          >
            <div className="relative w-full max-w-2xl">
              <motion.div
                style={{ y }}
                className="sticky top-20"
              >
                <img
                  src="/images/productos/maloobtalSinFondo.png"
                  alt="Maloobtal Product"
                  className="w-full h-full object-contain scale-125 drop-shadow-2xl"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Container1; 