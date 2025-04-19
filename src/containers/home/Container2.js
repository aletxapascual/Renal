import React from 'react'
import { Link } from 'react-router-dom'
import pacienteImg from '../../images/paciente.png'
import { useLanguage } from '../../context/LanguageContext'
import { FaUserMd, FaHospital, FaHeartbeat } from 'react-icons/fa'

function Container2() {
  const { language } = useLanguage()

  const features = [
    {
      icon: <FaUserMd className="w-12 h-12 text-[#5773BB]" />,
      title: language === 'es' ? 'Equipo Especializado' : 'Specialized Team',
      description: language === 'es' 
        ? 'Nuestro equipo médico está altamente capacitado y en constante actualización para brindar el mejor servicio.'
        : 'Our medical team is highly trained and constantly updated to provide the best service.'
    },
    {
      icon: <FaHospital className="w-12 h-12 text-[#5773BB]" />,
      title: language === 'es' ? 'Instalaciones Modernas' : 'Modern Facilities',
      description: language === 'es'
        ? 'Contamos con instalaciones de primer nivel y tecnología de vanguardia para garantizar tratamientos seguros y eficaces.'
        : 'We have first-class facilities and cutting-edge technology to ensure safe and effective treatments.'
    },
    {
      icon: <FaHeartbeat className="w-12 h-12 text-[#5773BB]" />,
      title: language === 'es' ? 'Atención Personalizada' : 'Personalized Care',
      description: language === 'es'
        ? 'Nos enfocamos en las necesidades individuales de cada paciente para brindar un tratamiento adaptado y efectivo.'
        : 'We focus on the individual needs of each patient to provide tailored and effective treatment.'
    }
  ]

  return (
    <div className="relative bg-gradient-to-br from-[#4466B7]/10 to-white mt-4 md:mt-0">
      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-24 py-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12">
          <div className="flex-1 min-h-[400px] w-full md:w-[600px] hidden md:block">
            <img 
              src={pacienteImg} 
              alt="Personal médico atendiendo a paciente de hemodiálisis"
              className="w-full h-full object-cover rounded-2xl shadow-xl"
              onError={(e) => {
                console.error('Error loading image');
                e.target.style.display = 'none';
              }}
            />
          </div>
          
          <div className="flex-1 max-w-xl">
            <div className="text-left">
              <span className="text-[#235AA7] font-medium">Acerca de Nosotros</span>
              <h2 className="text-4xl font-semibold text-[#235AA7] mt-2 mb-8">¿Quiénes Somos?</h2>
            </div>

            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed text-justify">
                En Renal nos dedicamos a brindar servicios de hemodiálisis 
                con un enfoque humano y tecnología de vanguardia.
              </p>

              <p className="leading-relaxed text-justify">
                Nuestro objetivo es ofrecer un ambiente cálido y acogedor, 
                donde cada paciente se sienta valorado y cuidado. 
                Contamos con un equipo de profesionales comprometidos 
                y equipos de última generación que garantizan 
                tratamientos seguros y efectivos.
              </p>

              <p className="leading-relaxed text-justify">
                Nos enorgullece ser un centro pionero en ofrecer 
                hemodiálisis fuera del entorno hospitalario, 
                proporcionando una experiencia más cómoda y menos 
                estresante para nuestros pacientes.
              </p>
            </div>

            <Link 
              to="/about"
              className="inline-flex items-center gap-2 bg-[#235AA7] hover:bg-[#4466B7] text-white px-6 py-3 rounded-full transition-colors mt-8"
            >
              <span className="text-xl">+</span> Conocer más
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Container2