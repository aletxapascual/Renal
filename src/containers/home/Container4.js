import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { FaChevronLeft, FaChevronRight, FaStar, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

function Container4() {
  const { language } = useLanguage();
  const [currentReview, setCurrentReview] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [showVideoControls, setShowVideoControls] = useState(false);
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const videoRef = useRef(null);

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

  const videoTestimonials = [
    {
      id: 1,
      src: '/videos/testimonio1.mp4'
    },
    {
      id: 2,
      src: '/videos/testimonio2.mp4'
    },
    {
      id: 3,
      src: '/videos/testimonio3.mp4'
    },
    {
      id: 4,
      src: '/videos/testimonio4.mp4'
    }
  ];

  // Reviews auto-rotation
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered, reviews.length]);

  // Video ended handler
  const handleVideoEnded = () => {
    setCurrentVideo((prev) => (prev + 1) % videoTestimonials.length);
    setShowVideoControls(false);
  };

  // Toggle audio
  const toggleAudio = () => {
    setIsVideoMuted(!isVideoMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isVideoMuted;
    }
  };

  // Handle video controls visibility
  const handleVideoMouseEnter = () => {
    setIsVideoHovered(true);
    setShowVideoControls(true);
  };

  const handleVideoMouseLeave = () => {
    setIsVideoHovered(false);
    setShowVideoControls(false);
  };

  const handleVideoClick = () => {
    setShowVideoControls(!showVideoControls);
  };

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const nextVideo = () => {
    setCurrentVideo((prev) => (prev + 1) % videoTestimonials.length);
    setShowVideoControls(false);
  };

  const prevVideo = () => {
    setCurrentVideo((prev) => (prev - 1 + videoTestimonials.length) % videoTestimonials.length);
    setShowVideoControls(false);
  };

  return (
    <div id="container4" className="relative py-24 bg-gradient-to-br from-white via-[#99AAD6]/20 to-[#99AAD6]/30">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#99AAD6]/20 to-transparent blur-3xl" />
        <div className="absolute top-20 -left-40 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#99AAD6]/20 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-20 w-[300px] h-[300px] rounded-full bg-gradient-to-tl from-[#99AAD6]/20 to-transparent blur-3xl" />
      </div>
      
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

        {/* Combined Video and Reviews Section */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 lg:p-8 ring-1 ring-[#5773BB]/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Video Section - Left on desktop, Top on mobile */}
              <div className="flex flex-col items-center h-auto lg:h-[500px] justify-center order-1 lg:order-1">
                <div 
                  className="relative w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[400px] h-[300px] sm:h-[350px] md:h-[400px] lg:h-[400px] rounded-2xl overflow-hidden bg-black mb-6"
                  onMouseEnter={handleVideoMouseEnter}
                  onMouseLeave={handleVideoMouseLeave}
                  onClick={handleVideoClick}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentVideo}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="w-full h-full"
                    >
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted={isVideoMuted}
                        playsInline
                        controls={showVideoControls}
                        onEnded={handleVideoEnded}
                      >
                        <source src={videoTestimonials[currentVideo].src} type="video/mp4" />
                        {language === 'es' ? 'Tu navegador no soporta videos.' : 'Your browser does not support videos.'}
                      </video>
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Audio Toggle Button - Only show when not showing controls */}
                  {!showVideoControls && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAudio();
                      }}
                      className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all duration-300 transform hover:scale-110"
                      aria-label={isVideoMuted ? 'Activar audio' : 'Silenciar audio'}
                    >
                      {isVideoMuted ? (
                        <FaVolumeMute className="w-4 h-4 lg:w-5 lg:h-5" />
                      ) : (
                        <FaVolumeUp className="w-4 h-4 lg:w-5 lg:h-5" />
                      )}
                    </button>
                  )}
                </div>

                {/* Video Navigation - Bottom */}
                <div className="flex items-center gap-3 lg:gap-4">
                  <button
                    onClick={prevVideo}
                    className="p-2 text-[#5773BB] hover:text-[#4466B7] transition-colors"
                    aria-label="Previous video"
                  >
                    <FaChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
                  </button>

                  <div className="flex gap-2">
                    {videoTestimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentVideo(index);
                          setShowVideoControls(false);
                        }}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentVideo
                            ? 'bg-gradient-to-r from-[#5773BB] to-[#4466B7]'
                            : 'bg-[#5773BB]/30 hover:bg-[#5773BB]/50'
                        }`}
                        aria-label={`Go to video ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextVideo}
                    className="p-2 text-[#5773BB] hover:text-[#4466B7] transition-colors"
                    aria-label="Next video"
                  >
                    <FaChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
                  </button>
                </div>
              </div>

              {/* Reviews Section - Right on desktop, Bottom on mobile */}
              <div className="flex flex-col items-center h-auto lg:h-[500px] justify-center order-2 lg:order-2">
                <div 
                  className="relative flex flex-col items-center"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div className="w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[400px] h-[300px] sm:h-[350px] md:h-[400px] lg:h-[400px] mb-6 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentReview}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-md p-3 sm:p-6 lg:p-8 ring-1 ring-[#5773BB]/10 h-full w-full flex flex-col justify-center"
                      >
                        <p className="text-base sm:text-base lg:text-lg text-gray-700 mb-3 sm:mb-6 lg:mb-8 text-center leading-relaxed px-1">
                          "{reviews[currentReview].text}"
                        </p>
                        <div className="flex flex-col items-center gap-2 sm:gap-4 lg:gap-6">
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
                                <FaStar className={`w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${hoveredStar !== null && i <= hoveredStar ? 'text-yellow-300' : 'text-yellow-400'}`} />
                              </motion.div>
                            ))}
                          </div>
                          <h4 className="text-lg sm:text-lg lg:text-xl font-semibold bg-gradient-to-r from-[#5773BB] to-[#4466B7] bg-clip-text text-transparent">
                            {reviews[currentReview].name}
                          </h4>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Reviews Navigation - Bottom */}
                  <div className="flex items-center gap-3 lg:gap-4">
                    <button
                      onClick={prevReview}
                      className="p-2 text-[#5773BB] hover:text-[#4466B7] transition-colors"
                      aria-label="Previous review"
                    >
                      <FaChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
                    </button>

                    <div className="flex gap-2">
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

                    <button
                      onClick={nextReview}
                      className="p-2 text-[#5773BB] hover:text-[#4466B7] transition-colors"
                      aria-label="Next review"
                    >
                      <FaChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Container4; 