import React from 'react'
import { Link } from 'react-router-dom'

function Container2() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-8 md:px-24 py-16 gap-12 bg-gradient-to-br from-blue-50/50 to-transparent">
      <div className="flex-1">
        <img 
          src="/images/about-hemodialysis.jpg" 
          alt="Personal médico atendiendo a paciente de hemodiálisis"
          className="w-full h-auto rounded-2xl shadow-lg"
        />
      </div>
      
      <div className="flex-1 space-y-6">
        <div className="space-y-4">
          <span className="text-blue-700 font-medium">Acerca de Nosotros</span>
          <h2 className="text-4xl font-semibold text-blue-600">¿Quiénes Somos?</h2>
        </div>

        <div className="space-y-6 text-gray-600">
          <p className="leading-relaxed">
            En Renal nos dedicamos a brindar servicios de hemodiálisis 
            con un enfoque humano y tecnología de vanguardia.
          </p>

          <p className="leading-relaxed">
            Nuestro objetivo es ofrecer un ambiente cálido y acogedor, 
            donde cada paciente se sienta valorado y cuidado. 
            Contamos con un equipo de profesionales comprometidos 
            y equipos de última generación que garantizan 
            tratamientos seguros y efectivos.
          </p>

          <p className="leading-relaxed">
            Nos enorgullece ser un centro pionero en ofrecer 
            hemodiálisis fuera del entorno hospitalario, 
            proporcionando una experiencia más cómoda y menos 
            estresante para nuestros pacientes.
          </p>
        </div>

        <Link 
          to="/about"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium border-2 border-blue-600 hover:border-blue-700 px-6 py-3 rounded-full transition-colors"
        >
          <span className="text-xl">+</span> Conocer más
        </Link>
      </div>
    </div>
  )
}

export default Container2