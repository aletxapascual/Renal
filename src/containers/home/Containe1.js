import React from 'react'

function Containe1() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-8 md:px-24 py-16 gap-8">
      <div className="flex-1">
        <h1 className="text-2xl text-blue-700 mb-4">Bienvenido a</h1>
        <h2 className="text-5xl text-blue-700 mb-8">Hemodiálisis Renal</h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Desde 2005, en <strong>RENALSTAR PENINSULAR</strong> ofrecemos hemodiálisis 
          de alta calidad con tecnología avanzada y un enfoque amigable, 
          brindando un beneficio psicológico a nuestros pacientes.
        </p>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full mb-8">
          <span>💬</span> Contáctanos
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
          <span>5.0 clasificación en Google</span>
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