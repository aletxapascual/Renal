import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import equipoImg from '../../images/equipo.png';
import sillon2Img from '../../images/sillon2.png';
import sillon3Img from '../../images/sillon3.png';
import { motion } from 'framer-motion';

function Container3() {
  const { language } = useLanguage();

  const features = [
    {
      title: "Tecnología Alemana de Última Generación",
      description: "Contamos con equipos Fresenius Medical Care importados de Alemania, reconocidos mundialmente por su precisión y confiabilidad. Estos equipos permiten una ultrafiltración controlada, lo que asegura tratamientos más seguros y personalizados, minimizando efectos secundarios y optimizando los resultados de cada sesión.",
      image: sillon2Img
    },
    {
      title: "Consumibles Biocompatibles",
      description: "Utilizamos insumos desechables de alta calidad, también de la marca Fresenius, diseñados para minimizar la irritación y mejorar la tolerancia del paciente. Cada detalle de nuestro proceso está cuidadosamente seleccionado para garantizar la máxima seguridad y comodidad.",
      image: equipoImg
    },
    {
      title: "Calidad Médica sin Ambiente Hospitalario",
      description: "Nos diferenciamos al romper el esquema tradicional. En lugar de ser un hospital, ofrecemos un centro especializado en hemodiálisis, donde cada elemento —desde los equipos médicos hasta el diseño del espacio— está pensado para que tu experiencia sea cómoda y eficiente, sin el estrés y la frialdad de un ambiente hospitalario.",
      image: sillon3Img
    }
  ];

  return (
    <div className="relative bg-white overflow-hidden py-12">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          className="font-sans text-4xl md:text-5xl font-bold text-[#5773BB] mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
        >
          ¿Qué nos distingue?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-gray-50 rounded-3xl p-8 hover:shadow-lg transition-shadow duration-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="aspect-square rounded-2xl overflow-hidden mb-6">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="font-sans text-2xl font-bold text-[#5773BB] mb-4">
                {feature.title}
              </h3>
              
              <p className="font-sans text-gray-600 text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Container3; 