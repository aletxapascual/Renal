import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FaStar } from 'react-icons/fa';

function Container4() {
  const { language } = useLanguage();
  const [currentReview, setCurrentReview] = useState(0);
  const timerRef = useRef(null);
  const timeoutRef = useRef(null);

  const reviews = [
    {
      id: 1,
      name: "Ángel Pérez",
      text: "El servicio es excelente, el personal está altamente capacitado y las instalaciones son de primer nivel. Me siento muy seguro y bien atendido en cada sesión.",
      stars: 5
    },
    {
      id: 2,
      name: "María Rosado",
      text: "El mejor lugar para recibir hemodiálisis. Los doctores y enfermeras son muy profesionales y amables. Las instalaciones siempre están limpias y bien mantenidas.",
      stars: 5
    },
    {
      id: 3,
      name: "Carlos Mendoza",
      text: "Increíble atención personalizada. El equipo médico está pendiente de cada detalle y siempre están dispuestos a resolver cualquier duda. Me han ayudado mucho en mi tratamiento.",
      stars: 5
    },
    {
      id: 4,
      name: "Laura Jiménez",
      text: "Un equipo médico excepcional que realmente se preocupa por el bienestar de sus pacientes. Las instalaciones son modernas y el ambiente es muy acogedor.",
      stars: 5
    },
    {
      id: 5,
      name: "Roberto García",
      text: "La mejor clínica de hemodiálisis que he conocido. El personal es muy profesional y siempre están atentos a cualquier necesidad. Me han dado una excelente atención.",
      stars: 5
    },
    {
      id: 6,
      name: "Ana Torres",
      text: "Estoy muy agradecida con todo el equipo. Su dedicación y profesionalismo han hecho que mi tratamiento sea mucho más llevadero. Las instalaciones son excelentes.",
      stars: 5
    }
  ];

  const startAutoSlide = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentReview(prev => (prev + 1) % reviews.length);
    }, 4000);
  }, [reviews.length]);

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [startAutoSlide]);

  const handleReviewChange = (newReview) => {
    setCurrentReview(newReview);
    if (timerRef.current) clearInterval(timerRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      startAutoSlide();
    }, 6000);
  };

  const nextReview = () => {
    const newReview = (currentReview + 1) % reviews.length;
    handleReviewChange(newReview);
  };

  const prevReview = () => {
    const newReview = (currentReview - 1 + reviews.length) % reviews.length;
    handleReviewChange(newReview);
  };

  const goToReview = (index) => {
    handleReviewChange(index);
  };

  return (
    <div className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h4 className="font-sans text-[#5773BB] text-lg font-medium mb-4">
            Testimonios
          </h4>
          <h2 className="font-sans text-4xl md:text-5xl font-bold text-[#5773BB] mb-8">
            Lo que dicen nuestros<br />
            pacientes sobre nosotros
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={prevReview}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 text-4xl text-gray-400 hover:text-gray-600 transition-colors z-20"
            aria-label="Previous review"
          >
            ‹
          </button>

          {/* Testimonial */}
          <div className="bg-white rounded-3xl p-12">
            <div className="md:hidden text-center text-gray-500 mb-4">
              Desliza para ver más opiniones ← →
            </div>
            <p className="font-sans text-2xl text-gray-800 italic leading-relaxed mb-8">
              "{reviews[currentReview].text}"
            </p>
            <div className="space-y-4">
              <div className="flex justify-center">
                {[...Array(reviews[currentReview].stars)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 w-6 h-6" />
                ))}
              </div>
              <h4 className="font-sans font-bold text-xl text-center text-gray-900">
                {reviews[currentReview].name}
              </h4>
            </div>
          </div>

          <button
            onClick={nextReview}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 text-4xl text-gray-400 hover:text-gray-600 transition-colors z-20"
            aria-label="Next review"
          >
            ›
          </button>

          {/* Dots indicator */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToReview(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentReview === index 
                    ? 'bg-[#5773BB] w-4' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Container4; 