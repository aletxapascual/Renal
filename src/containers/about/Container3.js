import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';

function Container3() {
  const { language } = useLanguage();

  const features = [
    {
      title: language === 'es' ? "Tecnología Alemana de Última Generación" : "Latest German Technology",
      description: language === 'es' 
        ? "Contamos con equipos Fresenius Medical Care importados de Alemania, reconocidos mundialmente por su precisión y confiabilidad. Estos equipos permiten una ultrafiltración controlada, lo que asegura tratamientos más seguros y personalizados, minimizando efectos secundarios y optimizando los resultados de cada sesión."
        : "We have Fresenius Medical Care equipment imported from Germany, globally recognized for its precision and reliability. These devices allow controlled ultrafiltration, ensuring safer and personalized treatments, minimizing side effects, and optimizing the results of each session.",
      image: "/images/sillon2.png"
    },
    {
      title: language === 'es' ? "Consumibles Biocompatibles" : "Biocompatible Consumables",
      description: language === 'es'
        ? "Utilizamos insumos desechables de alta calidad, también de la marca Fresenius, diseñados para minimizar la irritación y mejorar la tolerancia del paciente. Cada detalle de nuestro proceso está cuidadosamente seleccionado para garantizar la máxima seguridad y comodidad."
        : "We use high-quality disposable supplies, also from Fresenius, designed to minimize irritation and improve patient tolerance. Every detail of our process is carefully selected to ensure maximum safety and comfort.",
      image: "/images/equipo.png"
    },
    {
      title: language === 'es' ? "Calidad Médica sin Ambiente Hospitalario" : "Medical Quality without Hospital Environment",
      description: language === 'es'
        ? "Nos diferenciamos al romper el esquema tradicional. En lugar de ser un hospital, ofrecemos un centro especializado en hemodiálisis, donde cada elemento —desde los equipos médicos hasta el diseño del espacio— está pensado para que tu experiencia sea cómoda y eficiente, sin el estrés y la frialdad de un ambiente hospitalario."
        : "We differentiate ourselves by breaking the traditional scheme. Instead of being a hospital, we offer a specialized hemodialysis center, where every element—from medical equipment to space design—is designed to make your experience comfortable and efficient, without the stress and coldness of a hospital environment.",
      image: "/images/sillon3.png"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-white via-[#5773BB]/10 to-[#5773BB]/20 py-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#5773BB]/25 to-transparent blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#5773BB]/20 to-transparent blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          className="font-sans text-5xl font-bold text-[#5773BB] mb-8 text-center leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
        >
          {language === 'es' ? '¿Qué nos distingue?' : 'What sets us apart?'}
        </motion.h2>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4 place-items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg ring-1 ring-[#5773BB]/10 flex flex-col h-full"
            >
              <div className="mb-6 h-48 flex items-center justify-center">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-[#5773BB] mb-4 text-center">{feature.title}</h3>
              <div className="flex-grow flex flex-col justify-center">
                <p className="text-gray-700 leading-relaxed text-center">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Container3; 