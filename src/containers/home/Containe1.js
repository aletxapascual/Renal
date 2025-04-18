import React from 'react'
import { Link } from 'react-router-dom'

function Containe1() {
  return (
    <div className="flex flex-col md:flex-row items-start justify-between px-8 md:px-24 py-16 gap-8">
      <div className="flex-1">
        <div className="text-left">
          <h1 className="text-2xl text-blue-700 mb-4 font-normal">Bienvenido a</h1>
          <h2 className="text-5xl text-blue-700 mb-8 font-semibold">Hemodiálisis Renal</h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Desde 2005, en <strong>RENALSTAR PENINSULAR</strong> ofrecemos hemodiálisis 
            de alta calidad con tecnología avanzada y un enfoque amigable, 
            brindando un beneficio psicológico a nuestros pacientes.
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full mb-8 transition-colors"
          >
            <span>💬</span> Contáctanos
          </Link>
          <a 
            href="https://www.google.com/maps/place/Renal+-+Hemodiálisis+Clínica+de+Riñón+y+trasplante+renal/@21.014954,-89.584404,20z/data=!4m8!3m7!1s0x8f567726c5f5220d:0x3da0ddfb0de71cd1!8m2!3d21.0149535!4d-89.5844038!9m1!1b1!16s%2Fg%2F1tmplkmk?hl=es-419&entry=ttu&g_ep=EgoyMDI1MDQxMy4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
            <span className="underline">5.0 clasificación en Google</span>
          </a>
        </div>
      </div>
      <div className="flex-1">
        <img 
          src="/images/hemodialysis-room.jpg" 
          alt="Sala de hemodiálisis con equipos médicos modernos"
          className="w-full h-auto rounded-lg"
        />
      </div>
    </div>
  )
}

export default Containe1