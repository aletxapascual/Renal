import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';
import pacienteImg from '../../images/paciente.png';

function Container2() {
  const { language } = useLanguage();

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
    <div className="relative bg-gradient-to-br from-white via-[#5773BB]/5 to-[#5773BB]/10 py-12" id="container2">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#5773BB]/20 to-[#5773BB]/5 blur-3xl animate-pulse" />
        <div className="absolute top-20 -left-40 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#5773BB]/15 to-[#5773BB]/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-20 w-[300px] h-[300px] rounded-full bg-gradient-to-tl from-[#5773BB]/10 to-transparent blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission and Vision Sections */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Mission Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg ring-1 ring-[#5773BB]/10"
          >
            <motion.h2 
              className="text-5xl font-bold mb-8 bg-gradient-to-r from-[#5773BB] via-[#4466B7] to-[#5773BB] bg-clip-text text-transparent text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Misión
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 leading-relaxed text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Brindar atención nefrológica de excelencia que combine tecnología de vanguardia con un trato humano, empático y personalizado, mejorando la calidad de vida de cada uno de nuestros pacientes, con el trasplante renal como una meta alcanzable y parte fundamental del proceso.
            </motion.p>
          </motion.div>

          {/* Vision Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg ring-1 ring-[#5773BB]/10"
          >
            <motion.h2 
              className="text-5xl font-bold mb-8 bg-gradient-to-r from-[#5773BB] via-[#4466B7] to-[#5773BB] bg-clip-text text-transparent text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Visión
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 leading-relaxed text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Ser el centro de hemodiálisis líder en la Península de Yucatán, reconocido por su innovación tecnológica, calidez humana y compromiso con el bienestar integral de nuestros pacientes, guiándolos en el camino hacia una vida plena y, cuando sea posible, hacia el trasplante.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Quiénes Somos Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg ring-1 ring-[#5773BB]/10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
              <motion.h2 
                className="text-5xl font-bold mb-8 bg-gradient-to-r from-[#5773BB] via-[#4466B7] to-[#5773BB] bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Quiénes Somos
              </motion.h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed text-justify">
                <motion.p
                  variants={itemVariants}
                  className="transition-all duration-300 hover:text-gray-700"
                >
                  En Renal nos dedicamos a brindar servicios de hemodiálisis con un enfoque humano y tecnología de vanguardia. Nuestro objetivo es ofrecer un ambiente cálido y acogedor, donde cada paciente se sienta valorado y cuidado. Contamos con un equipo de profesionales comprometidos y equipos de última generación que garantizan tratamientos seguros y efectivos. Sabemos que la hemodiálisis es un paso importante, pero también trabajamos para que quienes sean candidatos puedan avanzar hacia el trasplante renal.
                </motion.p>
              </div>
            </motion.div>
            <motion.div 
              className="relative"
              variants={itemVariants}
            >
              <motion.div 
                className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={pacienteImg}
                  alt="Paciente recibiendo atención" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              {/* Decorative Elements */}
              <motion.div 
                className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#5773BB]/20 to-[#5773BB]/5 rounded-3xl -z-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              />
              <motion.div 
                className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-tr from-[#5773BB]/20 to-[#5773BB]/5 rounded-3xl -z-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Container2; 