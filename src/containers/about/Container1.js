import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import paciente1 from '../../images/pacientes/paciente1.png';
import paciente2 from '../../images/pacientes/paciente2.png';
import paciente3 from '../../images/pacientes/paciente3.png';
import paciente4 from '../../images/pacientes/paciente4.png';
import paciente5 from '../../images/pacientes/paciente5.png';
import pacienteImg from '../../images/paciente.png';

function Container1() {
  const { language } = useLanguage();
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += 0.5; // Slower scroll speed
      }
    };

    const intervalId = setInterval(scroll, 50); // Increased interval for smoother animation

    return () => clearInterval(intervalId);
  }, []);

  const images = [
    { src: paciente1, alt: "Paciente 1" },
    { src: paciente2, alt: "Paciente 2" },
    { src: paciente3, alt: "Paciente 3" },
    { src: paciente4, alt: "Paciente 4" },
    { src: paciente5, alt: "Paciente 5" },
    { src: pacienteImg, alt: "Paciente 6" },
    // Duplicate images to create seamless loop
    { src: paciente1, alt: "Paciente 1" },
    { src: paciente2, alt: "Paciente 2" },
    { src: paciente3, alt: "Paciente 3" },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-[#5773BB]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="font-sans text-6xl font-bold text-[#5773BB] mb-8">
            Sobre Nosotros
          </h1>
          <div className="text-gray-600 text-lg">
            <p className="font-sans">
              En nuestra empresa, creemos firmemente que el cuidado renal debe ir mucho más allá de lo técnico o lo rutinario. Cada paciente es una persona con emociones, necesidades y una historia única, por lo que nos enfocamos en ofrecer una atención integral que combine tecnología confiable con una verdadera vocación de servicio. Nuestra filosofía se basa en la calidez humana, la atención personalizada y el compromiso constante con la calidad médica.
            </p>
          </div>
        </div>

        {/* Image Carousel */}
        <div className="relative overflow-hidden">
          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-hidden whitespace-nowrap py-4"
          >
            {images.map((image, index) => (
              <div 
                key={index} 
                className="flex-none w-72 h-64 rounded-2xl overflow-hidden"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Container1; 