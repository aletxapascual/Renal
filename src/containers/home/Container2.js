import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import pacienteImg from '../../images/paciente.png'
import { useLanguage } from '../../context/LanguageContext'
import { FaUserMd, FaHospital, FaHeartbeat, FaHandHoldingMedical } from 'react-icons/fa'
import { motion } from 'framer-motion'

function Container2() {
  const { language } = useLanguage()
  const [hoveredFeature, setHoveredFeature] = useState(null)

  const features = [
    {
      icon: <FaUserMd className="w-12 h-12" />,
      title: language === 'es' ? 'Personal Especializado' : 'Specialized Staff',
      description: language === 'es' 
        ? 'Contamos con personal altamente capacitado y especializado en hemodiálisis.'
        : 'We have highly trained staff specialized in hemodialysis.'
    },
    {
      icon: <FaHospital className="w-12 h-12" />,
      title: language === 'es' ? 'Instalaciones Modernas' : 'Modern Facilities',
      description: language === 'es'
        ? 'Nuestras instalaciones están equipadas con la última tecnología médica.'
        : 'Our facilities are equipped with the latest medical technology.'
    },
    {
      icon: <FaHeartbeat className="w-12 h-12" />,
      title: language === 'es' ? 'Atención Personalizada' : 'Personalized Care',
      description: language === 'es'
        ? 'Brindamos atención personalizada y seguimiento constante a nuestros pacientes.'
        : 'We provide personalized care and constant monitoring to our patients.'
    },
    {
      icon: <FaHandHoldingMedical className="w-12 h-12" />,
      title: language === 'es' ? 'Solución Completa en Hemodiálisis' : 'Complete Hemodialysis Solution',
      description: language === 'es'
        ? 'Ofrecemos todo lo que necesitas en un solo lugar, con calidad y calidez.'
        : 'We offer everything you need in one place, with quality and warmth.'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div id="container2" className="relative py-24 bg-gradient-to-br from-white via-[#5773BB]/5 to-[#5773BB]/10">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#5773BB]/15 to-transparent blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#5773BB]/10 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl font-bold text-[#5773BB] mb-4 bg-gradient-to-r from-[#5773BB] to-[#4466B7] bg-clip-text text-transparent"
          >
            {language === 'es' ? '¿Por qué elegirnos?' : 'Why Choose Us?'}
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-700 max-w-3xl mx-auto"
          >
            {language === 'es' 
              ? 'Ofrecemos la mejor atención y tecnología en hemodiálisis'
              : 'We offer the best care and technology in hemodialysis'}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ring-1 ring-[#5773BB]/10 text-center"
            >
              <div className="text-[#5773BB] mb-4 transition-transform duration-300 hover:scale-110 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#5773BB] mb-4">{feature.title}</h3>
              <p className="text-gray-700 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default Container2