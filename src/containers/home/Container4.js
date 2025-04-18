import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

function Container4() {
  const { language } = useLanguage();
  const [currentReview, setCurrentReview] = useState(0);

  const reviews = [
    {
      id: 1,
      name: "Ángel Pérez",
      text: language === 'es' 
        ? "Excelente servicio y atención, el personal está altamente capacitado y las instalaciones son de primer nivel. Me siento muy seguro y bien atendido en cada sesión."
        : "Excellent service and attention, the staff is highly trained and the facilities are first class. I feel very safe and well cared for in each session.",
      role: language === 'es' ? "Paciente de Hemodiálisis" : "Hemodialysis Patient"
    },
    {
      id: 2,
      name: "María Rosado",
      text: language === 'es'
        ? "El mejor lugar para recibir hemodiálisis. Los doctores y enfermeras son muy profesionales y amables. Las instalaciones siempre están limpias y bien mantenidas."
        : "The best place to receive hemodialysis. The doctors and nurses are very professional and friendly. The facilities are always clean and well maintained.",
      role: language === 'es' ? "Paciente de Hemodiálisis" : "Hemodialysis Patient"
    },
    {
      id: 3,
      name: "Carlos Mendoza",
      text: language === 'es'
        ? "Increíble atención personalizada. El equipo médico está pendiente de cada detalle y siempre están dispuestos a resolver cualquier duda. Me han ayudado mucho en mi tratamiento."
        : "Amazing personalized attention. The medical team is aware of every detail and always willing to resolve any doubts. They have helped me a lot in my treatment.",
      role: language === 'es' ? "Paciente de Hemodiálisis" : "Hemodialysis Patient"
    },
    {
      id: 4,
      name: "Laura Jiménez",
      text: language === 'es'
        ? "Un equipo médico excepcional que realmente se preocupa por el bienestar de sus pacientes. Las instalaciones son modernas y el ambiente es muy acogedor."
        : "An exceptional medical team that really cares about their patients' well-being. The facilities are modern and the environment is very welcoming.",
      role: language === 'es' ? "Paciente de Hemodiálisis" : "Hemodialysis Patient"
    },
    {
      id: 5,
      name: "Roberto García",
      text: language === 'es'
        ? "La mejor clínica de hemodiálisis que he conocido. El personal es muy profesional y siempre están atentos a cualquier necesidad. Me han dado una excelente atención."
        : "The best hemodialysis clinic I've known. The staff is very professional and always attentive to any needs. They have given me excellent care.",
      role: language === 'es' ? "Paciente de Hemodiálisis" : "Hemodialysis Patient"
    },
    {
      id: 6,
      name: "Ana Torres",
      text: language === 'es'
        ? "Estoy muy agradecida con todo el equipo. Su dedicación y profesionalismo han hecho que mi tratamiento sea mucho más llevadero. Las instalaciones son excelentes."
        : "I am very grateful to the entire team. Their dedication and professionalism have made my treatment much more bearable. The facilities are excellent.",
      role: language === 'es' ? "Paciente de Hemodiálisis" : "Hemodialysis Patient"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <div className="relative bg-[#235AA7] py-20">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-white mb-16 uppercase tracking-wider">
          {language === 'es' 
            ? 'Opiniones de nuestros pacientes' 
            : 'Our patients testimonials'}
        </h2>

        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={prevReview}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 text-white text-4xl opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Previous review"
          >
            ‹
          </button>

          {/* Testimonial */}
          <div className="bg-white/10 rounded-3xl p-12 backdrop-blur-sm">
            <div className="md:hidden text-center text-white/60 mb-4">
              Desliza para ver más opiniones ← →
            </div>
            <p className="text-white text-xl leading-relaxed mb-8">
              "{reviews[currentReview].text}"
            </p>
            <div className="text-white">
              <h4 className="font-semibold text-lg">{reviews[currentReview].name}</h4>
              <p className="text-white/80">{reviews[currentReview].role}</p>
            </div>
          </div>

          <button
            onClick={nextReview}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 text-white text-4xl opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Next review"
          >
            ›
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentReview(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentReview === index ? 'bg-white w-4' : 'bg-white/50'
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