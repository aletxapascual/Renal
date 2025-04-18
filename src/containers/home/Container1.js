import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import equipoImg from '../../images/equipo.png';
import exteriorImg from '../../images/exterior.png';
import recepcionImg from '../../images/repcepcion.png';
import sillon1Img from '../../images/sillon1.png';

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

          {/* Slideshow */}
          <div className="flex-1 min-h-[400px] w-full md:w-[600px] relative bg-gray-100 rounded-2xl overflow-hidden">
            <div className="relative w-full h-[400px]">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
                    currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <img 
                    src={slide.image} 
                    alt={slide.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(`Error loading image: ${slide.image}`);
                      e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
                    }}
                  />
                </div>
              ))}

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors z-20"
                aria-label="Previous slide"
              >
                ‹
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors z-20"
                aria-label="Next slide"
              >
                ›
              </button>

              {/* Dots indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentSlide === index 
                        ? 'bg-white w-4' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
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