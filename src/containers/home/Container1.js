import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import equipoImg from '../../images/equipo.png';
import exteriorImg from '../../images/exterior.png';
import recepcionImg from '../../images/repcepcion.png';
import sillon1Img from '../../images/sillon1.png';
import { FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';

function Container1() {
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);
  const timeoutRef = useRef(null);

  const slides = [
    {
      image: equipoImg,
      alt: 'Equipo médico especializado',
      title: 'Equipo Especializado',
      description: 'Contamos con el mejor equipo médico y tecnológico.'
    },
    {
      image: exteriorImg,
      alt: 'Exterior de la clínica',
      title: 'Instalaciones Modernas',
      description: 'Ubicados estratégicamente para tu comodidad.'
    },
    {
      image: recepcionImg,
      alt: 'Recepción',
      title: 'Atención Personalizada',
      description: 'Te recibimos con calidez y profesionalismo.'
    },
    {
      image: sillon1Img,
      alt: 'Área de tratamiento',
      title: 'Área de Tratamiento',
      description: 'Espacios diseñados para tu confort y seguridad.'
    }
  ];

  const startAutoSlide = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);
  }, [slides.length]);

  useEffect(() => {
    // Preload images
    slides.forEach((slide, index) => {
      const img = new Image();
      img.src = slide.image;
      img.onload = () => {
        setImagesLoaded(prev => ({ ...prev, [index]: true }));
      };
      img.onerror = () => {
        console.error(`Failed to load image ${index}:`, slide.image);
      };
    });

    startAutoSlide();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [startAutoSlide]);

  const handleSlideChange = (newSlide) => {
    setCurrentSlide(newSlide);
    if (timerRef.current) clearInterval(timerRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      startAutoSlide();
    }, 6000);
  };

  const nextSlide = () => {
    const newSlide = (currentSlide + 1) % slides.length;
    handleSlideChange(newSlide);
  };

  const prevSlide = () => {
    const newSlide = (currentSlide - 1 + slides.length) % slides.length;
    handleSlideChange(newSlide);
  };

  const goToSlide = (index) => {
    handleSlideChange(index);
  };

  if (!Object.values(imagesLoaded).every(Boolean)) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#5773BB]"></div>
      </div>
    );
  }

  return (
    <div id="container1" className="relative min-h-[600px] bg-[#99AAD6]/70">
      {/* Background decorative elements with enhanced colors */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-white/10 to-transparent blur-3xl animate-pulse" />
        <div className="absolute top-20 -left-40 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-white/10 to-transparent blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-20 w-[300px] h-[300px] rounded-full bg-gradient-to-tl from-white/5 to-transparent blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content with complementary colors */}
          <div className="space-y-6 transform transition-all duration-500 hover:translate-y-[-8px]">
            <h4 className="font-sans text-[#2B4C8C] text-3xl mb-4 opacity-0 animate-fadeIn">
              Bienvenido a
            </h4>
            <h1 className="font-sans text-5xl font-bold text-[#2B4C8C] mb-8 opacity-0 animate-fadeIn animation-delay-200">
              Hemodiálisis Renal
            </h1>
            <p className="font-sans text-lg text-[#2B4C8C] mb-8 opacity-0 animate-fadeIn animation-delay-400 leading-relaxed">
              Desde 2005, en <span className="font-medium text-[#2B4C8C] hover:text-[#3A5FA0] transition-colors">RENAL</span> ofrecemos hemodiálisis de alta calidad con tecnología avanzada y un enfoque amigable, brindando un beneficio psicológico a nuestros pacientes.
            </p>
            <Link
              to="/contacto"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="font-sans inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-[#2B4C8C] hover:bg-[#3A5FA0] rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
            >
              <span>{language === 'es' ? 'Contáctanos' : 'Contact Us'}</span>
              <FaArrowRight className={`ml-2 transform transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''}`} />
            </Link>
          </div>

          {/* Enhanced Slideshow with improved styling */}
          <div className="relative transform transition-all duration-500 hover:translate-y-[-8px]">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300 ring-1 ring-[#2B4C8C]/10">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ${
                    index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
                  />
                  {/* Enhanced Slide Caption */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#2B4C8C]/90 via-[#2B4C8C]/70 to-transparent p-6 transform transition-transform duration-300">
                    <h3 className="text-white text-xl font-bold mb-2 drop-shadow-lg">{slide.title}</h3>
                    <p className="text-white/90 text-sm drop-shadow-md">{slide.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Navigation Buttons */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between p-4">
              <button
                onClick={prevSlide}
                className="p-3 rounded-full bg-white/90 hover:bg-white text-[#2B4C8C] transition-all duration-300 transform hover:scale-110 hover:shadow-lg backdrop-blur-sm"
              >
                <FaChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="p-3 rounded-full bg-white/90 hover:bg-white text-[#2B4C8C] transition-all duration-300 transform hover:scale-110 hover:shadow-lg backdrop-blur-sm"
              >
                <FaChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Container1;

// Add these animations to your global CSS file
/*
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 1s forwards;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

.animation-delay-400 {
  animation-delay: 400ms;
}
*/