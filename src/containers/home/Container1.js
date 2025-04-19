import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import equipoImg from '../../images/equipo.png';
import exteriorImg from '../../images/exterior.png';
import recepcionImg from '../../images/repcepcion.png';
import sillon1Img from '../../images/sillon1.png';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function Container1() {
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const timerRef = useRef(null);
  const timeoutRef = useRef(null);

  const slides = [
    {
      image: equipoImg,
      alt: 'Equipo médico especializado'
    },
    {
      image: exteriorImg,
      alt: 'Exterior de la clínica'
    },
    {
      image: recepcionImg,
      alt: 'Recepción'
    },
    {
      image: sillon1Img,
      alt: 'Área de tratamiento'
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
    <div className="relative min-h-[600px] bg-gradient-to-br from-white to-[#5773BB]/5">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#5773BB]/5 blur-3xl" />
        <div className="absolute top-20 -left-40 w-[400px] h-[400px] rounded-full bg-[#5773BB]/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div>
            <h4 className="font-sans text-[#5773BB] text-3xl mb-4">
              Bienvenido a
            </h4>
            <h1 className="font-sans text-5xl font-bold text-[#5773BB] mb-8">
              Hemodiálisis Renal
            </h1>
            <p className="font-sans text-lg text-gray-600 mb-8">
              Desde 2005, en <span className="font-medium">RENALSTAR PENINSULAR</span> ofrecemos hemodiálisis de alta calidad con tecnología avanzada y un enfoque amigable, brindando un beneficio psicológico a nuestros pacientes.
            </p>
            <Link
              to="/contacto"
              className="font-sans inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-[#5773BB] hover:bg-[#4466B7] rounded-full transition-colors duration-300"
            >
              {language === 'es' ? 'Contáctanos' : 'Contact Us'} 👋
            </Link>
          </div>

          {/* Slideshow */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between p-4">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-white/80 hover:bg-white text-[#5773BB] transition-colors duration-300"
              >
                <FaChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-white/80 hover:bg-white text-[#5773BB] transition-colors duration-300"
              >
                <FaChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 left-0 right-0">
              <div className="flex items-center justify-center gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === currentSlide ? 'bg-[#5773BB]' : 'bg-white/80 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Container1;