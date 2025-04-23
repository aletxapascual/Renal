import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FaMapMarkedAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Container5() {
  const { language } = useLanguage();

  return (
    <div className="relative bg-gradient-to-br from-white via-[#5773BB]/5 to-[#5773BB]/10 py-24 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#5773BB]/15 to-transparent blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#5773BB]/10 to-transparent blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h4 className="text-lg font-medium mb-4 bg-gradient-to-r from-[#5773BB] to-[#4466B7] bg-clip-text text-transparent">
            {language === 'es' ? 'Encuéntranos' : 'Find Us'}
          </h4>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-[#5773BB] via-[#4466B7] to-[#5773BB] bg-clip-text text-transparent">
            {language === 'es' ? 'Nuestra Ubicación' : 'Our Location'}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Map */}
          <motion.div 
            className="lg:col-span-3 w-full h-[500px] rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm ring-1 ring-[#5773BB]/10"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d931.8435183113835!2d-89.58465633065327!3d21.01495763677649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f567726c5f5220d%3A0x3da0ddfb0de71cd1!2sRenal%20-%20Hemodi%C3%A1lisis%20Cl%C3%ADnica%20de%20Ri%C3%B1%C3%B3n%20y%20trasplante%20renal!5e0!3m2!1ses!2smx!4v1708487800790!5m2!1ses!2smx"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de RENALSTAR PENINSULAR"
              className="transition-all duration-500"
            />
          </motion.div>

          {/* Location Information */}
          <motion.div 
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <motion.div 
                className="p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ring-1 ring-[#5773BB]/10"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-[#5773BB] to-[#4466B7] rounded-2xl text-white">
                    <FaMapMarkerAlt className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-sans text-xl font-bold bg-gradient-to-r from-[#5773BB] to-[#4466B7] bg-clip-text text-transparent mb-3">
                      {language === 'es' ? 'Dirección' : 'Address'}
                    </h4>
                    <p className="font-sans text-lg text-gray-600 leading-relaxed">
                      Altabrisa, Calle 26 No.202 Int. 5, 6 Y 7 Plaza las Brisas<br />
                      97130 Mérida, Yuc.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ring-1 ring-[#5773BB]/10"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-[#5773BB] to-[#4466B7] rounded-2xl text-white">
                    <FaClock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-sans text-xl font-bold bg-gradient-to-r from-[#5773BB] to-[#4466B7] bg-clip-text text-transparent mb-3">
                      {language === 'es' ? 'Horario' : 'Hours'}
                    </h4>
                    <p className="font-sans text-lg text-gray-600 leading-relaxed">
                      {language === 'es' ? 'Lunes a Sábado' : 'Monday to Saturday'}<br />
                      7:00 A.M. - 3:00 P.M.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.a
                href="https://www.google.com/maps/place/Renal+-+Hemodiálisis+Clínica+de+Riñón+y+trasplante+renal/@21.014954,-89.584404,18z/data=!4m6!3m5!1s0x8f567726c5f5220d:0x3da0ddfb0de71cd1!8m2!3d21.0149535!4d-89.5844038!16s%2Fg%2F1tmplkmk?hl=es&entry=ttu&g_ep=EgoyMDI1MDQyMC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-8 py-4 bg-gradient-to-r from-[#5773BB] to-[#4466B7] hover:from-[#4466B7] hover:to-[#5773BB] text-white font-sans font-semibold rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaMapMarkedAlt className="w-5 h-5 mr-2" />
                {language === 'es' ? 'Cómo Llegar' : 'Get Directions'}
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Container5; 