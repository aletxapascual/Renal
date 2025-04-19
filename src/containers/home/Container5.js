import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FaMapMarkedAlt } from 'react-icons/fa';

function Container5() {
  const { language } = useLanguage();

  return (
    <div className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-sans text-4xl md:text-5xl font-bold text-[#5773BB] text-center mb-16">
          Ubicación
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Map */}
          <div className="lg:col-span-3 w-full h-[500px] rounded-3xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d931.8435183113835!2d-89.58465633065327!3d21.01495763677649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f567726c5f5220d%3A0x3da0ddfb0de71cd1!2sRenal%20-%20Hemodi%C3%A1lisis%20Cl%C3%ADnica%20de%20Ri%C3%B1%C3%B3n%20y%20trasplante%20renal!5e0!3m2!1ses!2smx!4v1708487800790!5m2!1ses!2smx"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de RENALSTAR PENINSULAR"
            />
          </div>

          {/* Location Information */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-sans text-xl font-bold text-[#5773BB] mb-2">
                  Dirección
                </h4>
                <p className="font-sans text-lg text-gray-600">
                  Calle 7 #338, entre 42 y 44<br />
                  Col. García Gineres<br />
                  Mérida, Yucatán, México<br />
                  C.P. 97070
                </p>
              </div>

              <div>
                <h4 className="font-sans text-xl font-bold text-[#5773BB] mb-2">
                  Horario
                </h4>
                <p className="font-sans text-lg text-gray-600">
                  Lunes a Sábado<br />
                  7:00 AM - 7:00 PM
                </p>
              </div>

              <a
                href="https://www.google.com/maps/dir//Renal+-+Hemodi%C3%A1lisis+Cl%C3%ADnica+de+Ri%C3%B1%C3%B3n+y+trasplante+renal/@21.0149576,-89.5846563,19z/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#5773BB] text-white font-sans font-semibold rounded-full hover:bg-[#4563AB] transition-colors duration-300"
              >
                <FaMapMarkedAlt className="mr-2" />
                Cómo Llegar
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Container5; 