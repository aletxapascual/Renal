import React, { useState, useEffect, useCallback, useRef } from 'react';
import recepcionImg from '../images/optimized/repcepcion.webp';
import equipoImg from '../images/optimized/equipo.webp';
import exteriorImg from '../images/optimized/exterior.webp';
// Fallback images in PNG format
import recepcionFallback from '../images/backup/repcepcion.png';
import equipoFallback from '../images/backup/equipo.png';
import exteriorFallback from '../images/backup/exterior.png';

const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [supportsWebP, setSupportsWebP] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const timerRef = useRef(null);

  const slides = [
    { 
      image: recepcionImg,
      fallback: recepcionFallback,
      alt: 'Recepción de la clínica'
    },
    { 
      image: equipoImg,
      fallback: equipoFallback,
      alt: 'Equipo médico'
    },
    { 
      image: exteriorImg,
      fallback: exteriorFallback,
      alt: 'Vista exterior de la clínica'
    }
  ];

  // Check WebP support
  useEffect(() => {
    const checkWebPSupport = async () => {
      const webpImage = new Image();
      webpImage.onload = () => setSupportsWebP(true);
      webpImage.onerror = () => setSupportsWebP(false);
      webpImage.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
    };
    checkWebPSupport();
  }, []);

  // Preload images
  const preloadImages = useCallback(async () => {
    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    };

    try {
      const imagePromises = slides.map(slide => 
        loadImage(supportsWebP ? slide.image : slide.fallback)
      );
      await Promise.all(imagePromises);
      setImagesLoaded(true);
    } catch (err) {
      console.error('Error preloading images:', err);
      setImagesLoaded(true);
    }
  }, [slides, supportsWebP]);

  useEffect(() => {
    preloadImages();
  }, [preloadImages]);

  // Auto-advance slides with pause on hover
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      }, 5000);
    }
  }, [isPaused, slides.length]);

  useEffect(() => {
    if (!imagesLoaded) return;
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [imagesLoaded, startTimer]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!containerRef.current?.contains(document.activeElement)) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          prevSlide();
          break;
        case 'ArrowRight':
          nextSlide();
          break;
        case ' ':
          e.preventDefault();
          setIsPaused(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
    startTimer();
  }, [startTimer]);

  if (!imagesLoaded) {
    return (
      <div 
        className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-100 animate-pulse flex items-center justify-center"
        role="status"
        aria-label="Cargando imágenes"
      >
        <div className="text-gray-500">Cargando imágenes...</div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full rounded-2xl overflow-hidden group bg-gray-100"
      role="region"
      aria-label="Presentación de imágenes"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            role="group"
            aria-label={`Diapositiva ${index + 1} de ${slides.length}`}
          >
            <img
              src={supportsWebP ? slide.image : slide.fallback}
              alt={slide.alt}
              className="w-full h-full object-cover rounded-2xl"
              loading="lazy"
              onError={(e) => {
                console.error(`Error loading image: ${slide.alt}`);
                e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
              }}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Diapositiva anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Siguiente diapositiva"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={() => setIsPaused(prev => !prev)}
        className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label={isPaused ? "Reproducir presentación" : "Pausar presentación"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isPaused ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          )}
        </svg>
      </button>

      {/* Dots Navigation */}
      <div 
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2"
        role="tablist"
        aria-label="Navegación de diapositivas"
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white w-4' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            role="tab"
            aria-selected={index === currentSlide}
            aria-label={`Ir a diapositiva ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slideshow; 