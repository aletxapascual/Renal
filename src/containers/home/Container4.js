import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';

function Container4() {
  const { language } = useLanguage();
  const [currentReview, setCurrentReview] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(null);

  const reviews = [
    {
      name: 'Ángel Pérez',
      text: language === 'es'
        ? 'El servicio es excelente, el personal está altamente capacitado y las instalaciones son de primer nivel. Me siento muy seguro y bien atendido en cada sesión.'
        : 'The service is excellent, the staff is highly trained and the facilities are first class. I feel very safe and well cared for in each session.',
      stars: 5
    },
    {
      name: 'María González',
      text: language === 'es'
        ? 'Excelente atención y profesionalismo. El personal es muy amable y las instalaciones son de primera calidad.'
        : 'Excellent attention and professionalism. The staff is very friendly and the facilities are first class.',
      stars: 5
    },
    {
      name: 'Juan Pérez',
      text: language === 'es'
        ? 'Me siento muy bien atendido. El seguimiento médico es excelente y el ambiente es muy acogedor.'
        : 'I feel very well taken care of. The medical follow-up is excellent and the environment is very welcoming.',
      stars: 5
    },
    {
      name: 'Ana Martínez',
      text: language === 'es'
        ? 'La tecnología y el equipo médico son de vanguardia. Me siento segura y bien cuidada en todo momento.'
        : 'The technology and medical equipment are cutting-edge. I feel safe and well cared for at all times.',
      stars: 5
    },
    {
      name: 'Roberto Sánchez',
      text: language === 'es'
        ? 'Un servicio excepcional. El equipo médico demuestra gran profesionalismo y dedicación en cada tratamiento.'
        : 'Exceptional service. The medical team shows great professionalism and dedication in every treatment.',
      stars: 5
    },
    {
      name: 'Carmen Rodríguez',
      text: language === 'es'
        ? 'Estoy muy satisfecha con la atención recibida. El personal es muy atento y las instalaciones son modernas y cómodas.'
        : 'I am very satisfied with the care received. The staff is very attentive and the facilities are modern and comfortable.',
      stars: 5
    }
  ];

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered, reviews.length]);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <div className="bg-gradient-to-br from-[#5773BB]/5 via-white to-[#5773BB]/10 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h4 className="text-lg font-medium mb-4 bg-gradient-to-r from-[#5773BB] to-[#4466B7] bg-clip-text text-transparent">
            {language === 'es' ? 'Testimonios' : 'Testimonials'}
          </h4>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-[#5773BB] via-[#4466B7] to-[#5773BB] bg-clip-text text-transparent">
            {language === 'es' ? 'Lo que dicen nuestros' : 'What our'}
          </h2>
          <h2 className="text-5xl font-bold mb-16 bg-gradient-to-r from-[#5773BB] via-[#4466B7] to-[#5773BB] bg-clip-text text-transparent">
            {language === 'es' ? 'pacientes sobre nosotros' : 'patients say about us'}
          </h2>
        </div>

        <div 
          className="relative max-w-4xl mx-auto px-12"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            onClick={prevReview}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-[#5773BB] hover:text-[#4466B7] transition-colors"
            aria-label="Previous review"
          >
            <FaChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={nextReview}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-[#5773BB] hover:text-[#4466B7] transition-colors"
            aria-label="Next review"
          >
            <FaChevronRight className="w-8 h-8" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentReview}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-12 ring-1 ring-[#5773BB]/10"
            >
              <p className="text-2xl text-gray-700 mb-8 text-center leading-relaxed">
                "{reviews[currentReview].text}"
              </p>
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-1">
                  {[...Array(reviews[currentReview].stars)].map((_, i) => (
                    <motion.div
                      key={i}
                      onHoverStart={() => setHoveredStar(i)}
                      onHoverEnd={() => setHoveredStar(null)}
                      animate={{
                        rotate: hoveredStar === i ? [0, -10, 10, -10, 10, 0] : 0
                      }}
                      transition={{
                        rotate: {
                          duration: 0.5,
                          ease: "easeInOut"
                        }
                      }}
                    >
                      <FaStar className={`w-6 h-6 ${hoveredStar !== null && i <= hoveredStar ? 'text-yellow-300' : 'text-yellow-400'}`} />
                    </motion.div>
                  ))}
                </div>
                <h4 className="text-xl font-semibold bg-gradient-to-r from-[#5773BB] to-[#4466B7] bg-clip-text text-transparent">
                  {reviews[currentReview].name}
                </h4>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentReview(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentReview
                    ? 'bg-gradient-to-r from-[#5773BB] to-[#4466B7]'
                    : 'bg-[#5773BB]/30 hover:bg-[#5773BB]/50'
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