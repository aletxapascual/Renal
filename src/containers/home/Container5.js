import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

function Container5() {
  const { language } = useLanguage();

  return (
    <div className="relative bg-gradient-to-br from-[#235AA7]/5 to-white">
      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-24 py-12">
        <h2 className="text-4xl font-bold text-center text-[#235AA7] mb-12">
          {language === 'es' ? 'Ubicación' : 'Location'}
        </h2>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Map */}
          <div className="flex-1">
            <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <iframe
                title="Ubicación de Renal"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d931.8435183113835!2d-89.58465633065327!3d21.01495763677649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f567726c5f5220d%3A0x3da0ddfb0de71cd1!2sRenal%20-%20Hemodi%C3%A1lisis%20Cl%C3%ADnica%20de%20Ri%C3%B1%C3%B3n%20y%20trasplante%20renal!5e0!3m2!1ses!2smx!4v1708487800790!5m2!1ses!2smx"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Location Information */}
          <div className="flex-1 bg-white rounded-2xl p-8 shadow-xl border border-[#4466B7]/10">
            <h3 className="text-2xl font-semibold text-[#235AA7] mb-6">
              {language === 'es' ? 'Información de Ubicación' : 'Location Information'}
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-[#74A162] mb-2">
                  {language === 'es' ? 'Dirección' : 'Address'}
                </h4>
                <p className="text-gray-600">
                  Calle 7 #338, entre 42 y 44<br />
                  Col. García Ginerés<br />
                  Mérida, Yucatán, México<br />
                  C.P. 97070
                </p>
              </div>

              <div>
                <h4 className="text-lg font-medium text-[#74A162] mb-2">
                  {language === 'es' ? 'Horario' : 'Hours'}
                </h4>
                <p className="text-gray-600">
                  {language === 'es' ? 'Lunes a Sábado' : 'Monday to Saturday'}<br />
                  7:00 AM - 7:00 PM
                </p>
              </div>

              <a
                href="https://www.google.com/maps/dir//Renal+-+Hemodi%C3%A1lisis+Cl%C3%ADnica+de+Ri%C3%B1%C3%B3n+y+trasplante+renal/@21.014954,-89.584404,20z/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-6 py-3 mt-4 text-base font-medium text-white bg-[#235AA7] hover:bg-[#4466B7] rounded-full transition-colors duration-300"
              >
                {language === 'es' ? 'Cómo Llegar' : 'Get Directions'} 
                <span className="ml-2">🗺️</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Container5; 