import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

function Container1() {
  const { language } = useLanguage();

  return (
    <div className="bg-[#235AA7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-6xl font-bold text-white mb-8">
            Contáctanos
        </h1>
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-xl text-white/80 leading-relaxed">
            Si tú o un ser querido necesitan información sobre nuestros servicios de hemodiálisis, 
            o si deseas agendar una cita, no dudes en escribirnos o llamarnos. 
            Nuestro equipo estará encantado de apoyarte.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
          <div className="w-24 h-24 bg-[#5773BB]/20 rounded-full blur-2xl"></div>
        </div>
        <div className="absolute top-1/4 right-0 transform -translate-y-1/2">
          <div className="w-32 h-32 bg-[#74A162]/20 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-1/4 transform translate-y-1/2">
          <div className="w-40 h-40 bg-[#4466B7]/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}

export default Container1; 