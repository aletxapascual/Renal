import React, { useEffect, useRef, useState } from 'react';
import paciente1 from '../../images/pacientes/paciente1.png';
import paciente2 from '../../images/pacientes/paciente2.png';
import paciente3 from '../../images/pacientes/paciente3.png';
import paciente4 from '../../images/pacientes/paciente4.png';
import paciente5 from '../../images/pacientes/paciente5.png';
import pacienteImg from '../../images/paciente.png';

function PhotoSlideshow() {
  const scrollRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let isScrolling = true;
    let touchStartX = 0;
    let touchEndX = 0;
    let scrollInterval;

    const startScrolling = () => {
      if (scrollInterval) clearInterval(scrollInterval);
      
      scrollInterval = setInterval(() => {
        if (!isScrolling) return;
        
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        
        if (scrollContainer.scrollLeft >= maxScroll) {
          // Reset to beginning when reaching the end
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft += 1; // Increased scroll speed
        }
      }, 30);
    };

    // Start scrolling immediately
    startScrolling();

    // Touch event handlers
    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      isScrolling = false;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff > 0) {
          // Swipe left
          scrollContainer.scrollLeft += 200;
        } else {
          // Swipe right
          scrollContainer.scrollLeft -= 200;
        }
      }
      
      // Resume scrolling after a delay
      setTimeout(() => {
        isScrolling = true;
      }, 3000);
    };

    scrollContainer.addEventListener('touchstart', handleTouchStart);
    scrollContainer.addEventListener('touchend', handleTouchEnd);

    // Pause scrolling when the container is not visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
          isScrolling = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(scrollContainer);

    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
      observer.disconnect();
      scrollContainer.removeEventListener('touchstart', handleTouchStart);
      scrollContainer.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const images = [
    { src: paciente1, alt: "Paciente 1" },
    { src: paciente2, alt: "Paciente 2" },
    { src: paciente3, alt: "Paciente 3" },
    { src: paciente4, alt: "Paciente 4" },
    { src: paciente5, alt: "Paciente 5" },
    { src: pacienteImg, alt: "Paciente 6" },
    // Add only first image again to create smooth transition
    { src: paciente1, alt: "Paciente 1" }
  ];

  return (
    <div className="bg-gradient-to-b from-[#5773BB]/5 to-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden">
          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-hidden whitespace-nowrap py-2 touch-none"
          >
            {images.map((image, index) => (
              <div 
                key={index} 
                className="flex-none w-72 h-64 rounded-2xl overflow-hidden shadow-lg"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  draggable="false"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhotoSlideshow; 