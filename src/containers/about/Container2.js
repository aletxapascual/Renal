import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FaUserMd, FaHospital, FaHeartbeat, FaHandHoldingMedical } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Container2() {
  const { language } = useLanguage();

  const services = [
    {
      icon: <FaUserMd className="w-16 h-16 text-[#5773BB]" />,
      title: "Atención Personalizada",
      description: "Tratamos a cada paciente de manera individual, adaptando nuestros servicios a sus necesidades específicas."
    },
    {
      icon: <FaHospital className="w-16 h-16 text-[#5773BB]" />,
      title: "Instalaciones Modernas",
      description: "Contamos con espacios diseñados para maximizar tu comodidad durante el tratamiento."
    },
    {
      icon: <FaHeartbeat className="w-16 h-16 text-[#5773BB]" />,
      title: "Cuidado Integral",
      description: "Nos enfocamos tanto en tu bienestar físico como emocional durante todo el proceso."
    },
    {
      icon: <FaHandHoldingMedical className="w-16 h-16 text-[#5773BB]" />,
      title: "Apoyo Continuo",
      description: "Estamos contigo en cada paso del camino, brindando el soporte que necesitas."
    }
  ];

  return (
    <div className="bg-white py-16" id="container2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission and Vision Sections */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Mission Section */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h2 
              className="font-sans text-4xl font-bold text-[#5773BB] mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Misión
            </motion.h2>
            <motion.p 
              className="font-sans text-lg text-gray-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Brindar atención nefrológica de excelencia que combine tecnología de vanguardia con un trato humano, empático y personalizado, mejorando la calidad de vida de cada uno de nuestros pacientes.
            </motion.p>
          </motion.div>

          {/* Vision Section */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h2 
              className="font-sans text-4xl font-bold text-[#5773BB] mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Visión
            </motion.h2>
            <motion.p 
              className="font-sans text-lg text-gray-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Ser el centro de hemodiálisis líder en la Península de Yucatán, reconocido por su innovación tecnológica, calidez humana y compromiso con el bienestar integral de nuestros pacientes.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="bg-[#5773BB]/10 rounded-full p-6 mb-6"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(87, 115, 187, 0.2)" }}
                transition={{ duration: 0.3 }}
              >
                {service.icon}
              </motion.div>
              <h3 className="font-sans text-2xl font-bold text-[#5773BB] mb-4">
                {service.title}
              </h3>
              <p className="font-sans text-gray-600">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Container2; 