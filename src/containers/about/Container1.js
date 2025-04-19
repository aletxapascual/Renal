import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import paciente1 from '../../images/pacientes/paciente1.png';
import paciente2 from '../../images/pacientes/paciente2.png';
import paciente3 from '../../images/pacientes/paciente3.png';
import paciente4 from '../../images/pacientes/paciente4.png';
import paciente5 from '../../images/pacientes/paciente5.png';
import pacienteImg from '../../images/paciente.png';

function Container1() {
  const { language } = useLanguage();

  return (
    <div className="relative bg-gradient-to-br from-white to-[#5773BB]/5 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#5773BB]/5 blur-3xl" />
        <div className="absolute top-20 -left-40 w-[400px] h-[400px] rounded-full bg-[#5773BB]/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div>
            <h1 className="font-sans text-6xl font-bold text-[#5773BB] mb-8 leading-tight">
              Conectamos<br />
              tecnología con<br />
              humanidad
            </h1>
            <div className="space-y-6 text-gray-600 text-lg">
              <p className="font-sans">
                En RENALSTAR PENINSULAR, creemos firmemente que el cuidado renal debe ir mucho más allá de lo técnico o lo rutinario. Para nosotros, cada paciente es una persona con emociones, necesidades y una historia única, no solo alguien que necesita un tratamiento médico.
              </p>
              <p className="font-sans">
                Por eso, nos esforzamos día a día en ofrecer una atención integral que combine tecnología confiable con una verdadera vocación de servicio. Nos mueve una filosofía basada en la calidez humana, la atención personalizada y el compromiso constante con la calidad médica. 
              </p>
            </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto lg:mx-0">
            {/* Left column */}
            <div className="space-y-3 sm:space-y-6">
              <div className="aspect-[4/5] rounded-xl sm:rounded-3xl overflow-hidden shadow-lg bg-white w-full max-w-[120px] sm:max-w-none mx-auto">
                <img
                  src={paciente1}
                  alt="Patient care"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[4/5] rounded-xl sm:rounded-3xl overflow-hidden shadow-lg bg-white w-full max-w-[120px] sm:max-w-none mx-auto">
                <img
                  src={pacienteImg}
                  alt="Patient care"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Middle column */}
            <div className="space-y-3 sm:space-y-6 mt-6 sm:mt-12">
              <div className="aspect-[4/5] rounded-xl sm:rounded-3xl overflow-hidden shadow-lg bg-white w-full max-w-[120px] sm:max-w-none mx-auto">
                <img
                  src={paciente2}
                  alt="Medical consultation"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[4/5] rounded-xl sm:rounded-3xl overflow-hidden shadow-lg bg-white w-full max-w-[120px] sm:max-w-none mx-auto">
                <img
                  src={paciente3}
                  alt="Patient support"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-3 sm:space-y-6 mt-12 sm:mt-24">
              <div className="aspect-[4/5] rounded-xl sm:rounded-3xl overflow-hidden shadow-lg bg-white w-full max-w-[120px] sm:max-w-none mx-auto">
                <img
                  src={paciente4}
                  alt="Medical care"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[4/5] rounded-xl sm:rounded-3xl overflow-hidden shadow-lg bg-white w-full max-w-[120px] sm:max-w-none mx-auto">
                <img
                  src={paciente5}
                  alt="Patient care"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Container1; 