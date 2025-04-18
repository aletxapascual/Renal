import React, { useState, useEffect } from 'react';
import recepcionImg from '../images/repcepcion.png';
import equipoImg from '../images/equipo.png';
import exteriorImg from '../images/exterior.png';

const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const slides = [
    { 
      image: recepcionImg,
      alt: 'Recepción'
    },
    { 
      image: equipoImg,
      alt: 'Equipo'
    },
    { 
      image: exteriorImg,
      alt: 'Exterior'
    }
  ];

  useEffect(() => {
    console.log('Slides:', slides); // Debug log
    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          console.log('Image loaded:', src); // Debug log
          resolve();
        };
        img.onerror = (e) => {
          console.error('Error loading image:', src, e); // Debug log
          reject(e);
        };
      });
    };

    Promise.all(slides.map(slide => loadImage(slide.image)))
      .then(() => {
        console.log('All images loaded successfully'); // Debug log
        setImagesLoaded(true);
      })
      .catch(err => {
        console.error('Error loading images:', err);
        setImagesLoaded(true); // Still set to true to show fallback
      });
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;

    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [imagesLoaded]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  if (!imagesLoaded) {
    return (
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-100 animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Cargando imágenes...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden group bg-gray-100">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover rounded-2xl"
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
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white w-4' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slideshow; 