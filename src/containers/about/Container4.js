import React from 'react';
import { FaFacebookF, FaEnvelope, FaPhone, FaGlobe } from 'react-icons/fa';
import { motion } from 'framer-motion';
import doctorImg from '../../images/doctor.jpg';
import doctoralia from '../../images/doctoraliaLogo.png';

function Container4() {
  return (
    <div className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
        >
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <motion.h4 
              className="font-sans text-[#5773BB] text-xl mb-4"
              whileHover={{ color: "#4466B7" }}
              transition={{ duration: 0.2 }}
            >
              Especialista en Nefrología
            </motion.h4>
            <motion.h1 
              className="font-sans text-5xl font-bold text-[#5773BB] mb-6"
              whileHover={{ color: "#4466B7" }}
              transition={{ duration: 0.2 }}
            >
              Dr. Mario Arturo<br />
              Burgos Soto
            </motion.h1>

            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="font-sans text-xl font-semibold text-[#5773BB] mb-2">
                  Formación Académica
                </h3>
                <p className="font-sans text-lg text-gray-600">
                  Médico Cirujano (UADY), Especialista en Medicina Interna y Nefrología (CMNO)<br />
                  Certificado y Recertificado por el Consejo Mexicano de Nefrología<br />
                  Miembro de la Sociedad Mexicana de Nefrología, Sociedad Mexicana de Trasplantes y American Society of Nephrology
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="font-sans text-xl font-semibold text-[#5773BB] mb-2">
                  Áreas de especialidad
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-lg text-gray-600">
                  <motion.li 
                    className="flex items-center space-x-2"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="w-2 h-2 bg-[#5773BB] rounded-full"></span>
                    <span>Nefropatías Glomerulares</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-center space-x-2"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="w-2 h-2 bg-[#5773BB] rounded-full"></span>
                    <span>Hipertensión</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-center space-x-2"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="w-2 h-2 bg-[#5773BB] rounded-full"></span>
                    <span>Anemias</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-center space-x-2"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="w-2 h-2 bg-[#5773BB] rounded-full"></span>
                    <span>Hemodiálisis</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-center space-x-2"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="w-2 h-2 bg-[#5773BB] rounded-full"></span>
                    <span>Trasplante Renal</span>
                  </motion.li>
                </ul>
              </motion.div>
              
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="flex items-center space-x-3 text-gray-600"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaEnvelope className="w-5 h-5 text-[#5773BB]" />
                  <a href="mailto:drburgos@hemodialisis.com.mx" className="hover:text-[#5773BB] transition-colors">
                    drburgos@hemodialisis.com.mx
                  </a>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="flex space-x-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <motion.a 
                  href="https://www.facebook.com/nefrologomerida/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="h-12 px-4 flex items-center justify-center rounded-full border-2 border-[#5773BB] text-[#5773BB] hover:bg-[#5773BB] hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaFacebookF className="w-5 h-5 md:mr-2" />
                  <span className="font-semibold hidden md:inline">Facebook</span>
                </motion.a>
                <motion.a 
                  href="https://www.doctoralia.com.mx/mario-arturo-burgos-soto/nefrologo/yucatan" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="h-12 px-4 flex items-center justify-center rounded-full border-2 border-[#5773BB] text-[#5773BB] hover:bg-[#5773BB] hover:text-white group transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img 
                    src={doctoralia} 
                    alt="Doctoralia Profile"
                    className="h-6 object-contain md:mr-2 [filter:brightness(0)_saturate(100%)_invert(45%)_sepia(19%)_saturate(1404%)_hue-rotate(187deg)_brightness(100%)_contrast(87%)] group-hover:brightness-0 group-hover:invert-[100%] group-hover:sepia-0 group-hover:saturate-100 group-hover:contrast-100 transition-all"
                  />
                  <span className="font-semibold hidden md:inline">Doctoralia</span>
                </motion.a>
                <motion.a 
                  href="https://nefrologomerida.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="h-12 px-4 flex items-center justify-center rounded-full border-2 border-[#5773BB] text-[#5773BB] hover:bg-[#5773BB] hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaGlobe className="w-5 h-5 md:mr-2" />
                  <span className="font-semibold hidden md:inline">Sitio Web</span>
                </motion.a>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={doctorImg} 
                alt="Dr. Mario Arturo Burgos Soto" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            {/* Decorative Elements */}
            <motion.div 
              className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#5773BB]/5 rounded-3xl -z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            />
            <motion.div 
              className="absolute -top-6 -left-6 w-32 h-32 bg-[#5773BB]/5 rounded-3xl -z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Container4; 