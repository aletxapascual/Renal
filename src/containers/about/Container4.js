import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FaFacebookF, FaEnvelope, FaGlobe } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Container4() {
  const { language } = useLanguage();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const specialtyAreas = [
    'Nefropatías Glomerulares', 
    'Hipertensión', 
    'Anemias', 
    'Hemodiálisis', 
    'Trasplante Renal'
  ];

  return (
    <div className="relative bg-gradient-to-br from-white via-[#5773BB]/5 to-[#5773BB]/10 py-24">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#5773BB]/20 to-[#5773BB]/5 blur-3xl animate-pulse" />
        <div className="absolute top-20 -left-40 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#5773BB]/15 to-[#5773BB]/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-20 w-[300px] h-[300px] rounded-full bg-gradient-to-tl from-[#5773BB]/10 to-transparent blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Left Content */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg ring-1 ring-[#5773BB]/10"
          >
            <motion.h4 
              className="font-sans bg-gradient-to-r from-[#5773BB] via-[#4466B7] to-[#5773BB] bg-clip-text text-transparent text-xl mb-4"
            >
              {language === 'es' ? 'Especialista en Nefrología' : 'Nephrology Specialist'}
            </motion.h4>
            <motion.h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#5773BB] to-[#4466B7] bg-clip-text text-transparent">
              Dr. Mario Arturo<br />
              Burgos Soto
            </motion.h2>
            <p className="text-lg text-gray-700 mb-4">
              {language === 'es'
                ? 'Nefrólogo certificado, especialista en hemodiálisis y trasplante renal. Con más de 15 años de experiencia, el Dr. Burgos Soto lidera nuestro equipo médico, brindando atención personalizada y de calidad a cada paciente.'
                : 'Certified nephrologist, specialist in hemodialysis and kidney transplantation. With more than 15 years of experience, Dr. Burgos Soto leads our medical team, providing personalized and quality care to each patient.'}
            </p>

            <motion.div
              className="space-y-6"
              variants={itemVariants}
            >
              <motion.div
                className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-md"
              >
                <h3 className="font-sans text-xl font-semibold bg-gradient-to-r from-[#5773BB] to-[#4466B7] bg-clip-text text-transparent mb-2">
                  {language === 'es' ? 'Formación Académica' : 'Academic Background'}
                </h3>
                <ul className="list-disc ml-6 text-lg text-gray-600">
                  {language === 'es' ? (
                    <>
                      <li>Médico Cirujano (UADY), Especialista en Medicina Interna y Nefrología (CMNO)</li>
                      <li>Certificado y Recertificado por el Consejo Mexicano de Nefrología</li>
                      <li>Miembro de la Sociedad Mexicana de Nefrología, Sociedad Mexicana de Trasplantes y American Society of Nephrology</li>
                    </>
                  ) : (
                    <>
                      <li>Medical Doctor (UADY), Specialist in Internal Medicine and Nephrology (CMNO)</li>
                      <li>Certified and Recertified by the Mexican Council of Nephrology</li>
                      <li>Member of the Mexican Society of Nephrology, Mexican Society of Transplants, and American Society of Nephrology</li>
                    </>
                  )}
                </ul>
              </motion.div>

              <motion.div
                className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-md"
              >
                <h3 className="font-sans text-xl font-semibold bg-gradient-to-r from-[#5773BB] to-[#4466B7] bg-clip-text text-transparent mb-2">
                  {language === 'es' ? 'Áreas de especialidad' : 'Specialty Areas'}
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2 text-lg text-gray-600">
                  <motion.li className="flex items-center space-x-2"><span className="w-2 h-2 bg-gradient-to-r from-[#5773BB] to-[#4466B7] rounded-full flex-shrink-0"></span><span className="whitespace-nowrap">{language === 'es' ? 'Nefropatías Glomerulares' : 'Glomerular Nephropathies'}</span></motion.li>
                  <motion.li className="flex items-center space-x-2"><span className="w-2 h-2 bg-gradient-to-r from-[#5773BB] to-[#4466B7] rounded-full flex-shrink-0"></span><span className="whitespace-nowrap">{language === 'es' ? 'Hipertensión' : 'Hypertension'}</span></motion.li>
                  <motion.li className="flex items-center space-x-2"><span className="w-2 h-2 bg-gradient-to-r from-[#5773BB] to-[#4466B7] rounded-full flex-shrink-0"></span><span className="whitespace-nowrap">{language === 'es' ? 'Anemias' : 'Anemias'}</span></motion.li>
                  <motion.li className="flex items-center space-x-2"><span className="w-2 h-2 bg-gradient-to-r from-[#5773BB] to-[#4466B7] rounded-full flex-shrink-0"></span><span className="whitespace-nowrap">{language === 'es' ? 'Hemodiálisis' : 'Hemodialysis'}</span></motion.li>
                  <motion.li className="flex items-center space-x-2"><span className="w-2 h-2 bg-gradient-to-r from-[#5773BB] to-[#4466B7] rounded-full flex-shrink-0"></span><span className="whitespace-nowrap">{language === 'es' ? 'Trasplante Renal' : 'Kidney Transplant'}</span></motion.li>
                </ul>
              </motion.div>
              
              <motion.div 
                className="space-y-4 bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-md"
              >
                <motion.div 
                  className="flex items-center space-x-3 text-gray-600"
                >
                  <div className="p-2 bg-gradient-to-r from-[#5773BB] to-[#4466B7] rounded-lg">
                    <FaEnvelope className="w-5 h-5 text-white" />
                  </div>
                  <a href="mailto:drburgos@hemodialisis.com.mx" className="text-gray-600">
                    drburgos@hemodialisis.com.mx
                  </a>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="flex space-x-4"
                variants={itemVariants}
              >
                <motion.a 
                  href="https://www.facebook.com/nefrologomerida/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 h-12 px-4 flex items-center justify-center rounded-full border-2 border-[#5773BB] text-[#5773BB] hover:bg-gradient-to-r hover:from-[#5773BB] hover:to-[#4466B7] hover:text-white transition-colors duration-300"
                >
                  <FaFacebookF className="w-5 h-5 md:mr-2" />
                  <span className="font-semibold hidden md:inline">Facebook</span>
                </motion.a>
                <motion.a 
                  href="https://www.doctoralia.com.mx/mario-arturo-burgos-soto/nefrologo/yucatan" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 h-12 px-4 flex items-center justify-center rounded-full border-2 border-[#5773BB] text-[#5773BB] hover:bg-gradient-to-r hover:from-[#5773BB] hover:to-[#4466B7] hover:text-white transition-colors duration-300"
                >
                  <img 
                    src="/images/doctoraliaLogo.png"
                    alt="Doctoralia Profile"
                    className="h-6 object-contain md:mr-2 [filter:brightness(0)_saturate(100%)_invert(45%)_sepia(19%)_saturate(1404%)_hue-rotate(187deg)_brightness(100%)_contrast(87%)] group-hover:brightness-0 group-hover:invert-[100%] group-hover:sepia-0 group-hover:saturate-100 group-hover:contrast-100 transition-all"
                  />
                  <span className="font-semibold hidden md:inline">Doctoralia</span>
                </motion.a>
                <motion.a 
                  href="https://nefrologomerida.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 h-12 px-4 flex items-center justify-center rounded-full border-2 border-[#5773BB] text-[#5773BB] hover:bg-gradient-to-r hover:from-[#5773BB] hover:to-[#4466B7] hover:text-white transition-colors duration-300"
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
            variants={itemVariants}
          >
            <motion.div 
              className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl"
            >
              <img 
                src="/images/doctor.jpg"
                alt="Dr. Mario Arturo Burgos Soto" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            {/* Decorative Elements */}
            <motion.div 
              className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#5773BB]/20 to-[#5773BB]/5 rounded-3xl -z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            />
            <motion.div 
              className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-tr from-[#5773BB]/20 to-[#5773BB]/5 rounded-3xl -z-10"
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