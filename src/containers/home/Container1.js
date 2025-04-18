import React from 'react'
import { Link } from 'react-router-dom'
import equipoImg from '../../images/equipo.png'

function Container1() {
  return (
    <div className="relative bg-gradient-to-br from-white to-blue-50 overflow-hidden">
      {/* Curved background shape */}
      <div 
        className="absolute top-0 right-0 w-[80%] h-[150%] bg-[#5773BB] rounded-bl-[100%] transform translate-x-[20%] -translate-y-[30%] opacity-10"
        style={{ zIndex: 0 }}
      />
      <div 
        className="absolute top-0 right-0 w-[75%] h-[150%] bg-[#5773BB] rounded-bl-[100%] transform translate-x-[20%] -translate-y-[20%] opacity-15"
        style={{ zIndex: 1 }}
      />
      <div 
        className="absolute top-0 right-0 w-[70%] h-[150%] bg-[#5773BB] rounded-bl-[100%] transform translate-x-[20%] -translate-y-[10%] opacity-20"
        style={{ zIndex: 2 }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-24 py-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12">
          <div className="flex-1 max-w-xl">
            <div className="text-left">
              <h1 className="text-2xl text-[#5773BB] mb-4 font-normal">Bienvenido a</h1>
              <h2 className="text-5xl text-[#5773BB] mb-8 font-semibold">Hemodiálisis Renal</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Desde 2005, en <strong>RENALSTAR PENINSULAR</strong> ofrecemos hemodiálisis 
                de alta calidad con tecnología avanzada y un enfoque amigable, 
                brindando un beneficio psicológico a nuestros pacientes.
              </p>
              <Link 
                to="/contact" 
                className="inline-flex items-center gap-2 bg-[#5773BB] hover:bg-[#4A62A3] text-white px-6 py-3 rounded-full mb-8 transition-colors"
              >
                <span>💬</span> Contáctanos
              </Link>
              <a 
                href="https://www.google.com/maps/place/Renal+-+Hemodiálisis+Clínica+de+Riñón+y+trasplante+renal/@21.014954,-89.584404,20z/data=!4m8!3m7!1s0x8f567726c5f5220d:0x3da0ddfb0de71cd1!8m2!3d21.0149535!4d-89.5844038!9m1!1b1!16s%2Fg%2F1tmplkmk?hl=es-419&entry=ttu&g_ep=EgoyMDI1MDQxMy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#5773BB] transition-colors"
              >
                <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
                <span className="underline">5.0 clasificación en Google</span>
              </a>
            </div>
          </div>
          <div className="flex-1 min-h-[400px] w-full md:w-[600px]">
            <img 
              src={equipoImg} 
              alt="Equipo médico"
              className="w-full h-full object-cover rounded-2xl shadow-xl"
              onError={(e) => {
                console.error('Error loading image');
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Container1