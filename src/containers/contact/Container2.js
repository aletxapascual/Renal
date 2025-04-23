import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaMapMarkedAlt, FaClock, FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Container2() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(formData);
    setShowSuccess(true);
    setIsSubmitting(false);
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: FaPhone,
      label: 'Teléfono',
      value: '999 930 6925',
      href: 'tel:9999306925'
    },
    {
      icon: FaEnvelope,
      label: 'Email',
      value: 'gerencia@hemodialisis.com.mx',
      href: 'mailto:gerencia@hemodialisis.com.mx'
    },
    {
      icon: FaMapMarkerAlt,
      label: 'Ubicación',
      value: 'Altabrisa \nCalle 26 No.202 Int. 5 \n6 Y 7 Plaza las Brisas\n 97130 Mérida, Yuc.'
    },
    {
      icon: FaClock,
      label: 'Horario',
      value: 'Lunes a Sábado: 7:00 AM - 3:00 PM'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="relative bg-gradient-to-br from-white via-[#5773BB]/5 to-[#5773BB]/10 py-12">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#5773BB]/15 to-transparent blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#5773BB]/10 to-transparent blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 ring-1 ring-[#5773BB]/10"
          >
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl font-bold text-[#5773BB] mb-8"
            >
              ¿Cómo podemos ayudarte?
            </motion.h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { id: 'name', label: '¿Cuál es tu nombre?', type: 'text', placeholder: 'Tu nombre' },
                { id: 'email', label: '¿Cuál es tu correo electrónico?', type: 'email', placeholder: 'correo@ejemplo.com' },
                { id: 'phone', label: '¿Cuál es tu número telefónico?', type: 'tel', placeholder: '(999) 123-4567' }
              ].map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                >
                  <label htmlFor={field.id} className="block text-lg font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    value={formData[field.id]}
                    onChange={handleChange}
                    onFocus={() => setFocusedField(field.id)}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 rounded-xl border bg-white/70 backdrop-blur-sm transition-all duration-300
                      ${focusedField === field.id
                        ? 'border-[#5773BB] ring-2 ring-[#5773BB]/20'
                        : 'border-gray-300 hover:border-[#5773BB]'
                      }
                    `}
                    placeholder={field.placeholder}
                  />
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label htmlFor="message" className="block text-lg font-medium text-gray-700 mb-2">
                  ¿Tienes algún mensaje para nosotros?
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  rows="4"
                  className={`w-full px-4 py-3 rounded-xl border bg-white/70 backdrop-blur-sm transition-all duration-300
                    ${focusedField === 'message'
                      ? 'border-[#5773BB] ring-2 ring-[#5773BB]/20'
                      : 'border-gray-300 hover:border-[#5773BB]'
                    }
                  `}
                  placeholder="Escribe tu mensaje aquí..."
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-[#5773BB] to-[#4466B7] text-white font-medium py-3 px-6 rounded-xl
                  transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg
                  flex items-center justify-center space-x-2
                  ${isSubmitting ? 'opacity-75 cursor-wait' : 'hover:from-[#4466B7] hover:to-[#5773BB]'}
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Enviar Mensaje</span>
                <FaPaperPlane className={`w-4 h-4 transition-transform duration-300 ${isSubmitting ? 'animate-pulse' : ''}`} />
              </motion.button>

              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-600 text-center mt-4"
                >
                  ¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ring-1 ring-[#5773BB]/10"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-[#5773BB] to-[#4466B7] rounded-2xl text-white">
                    <info.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-sans text-xl font-bold bg-gradient-to-r from-[#5773BB] to-[#4466B7] bg-clip-text text-transparent mb-2">
                      {info.label}
                    </h3>
                    {info.href ? (
                      <a 
                        href={info.href}
                        className="text-lg text-gray-600 hover:text-[#5773BB] transition-colors whitespace-pre-line"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-lg text-gray-600 whitespace-pre-line">
                        {info.value}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Map */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm p-2 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 ring-1 ring-[#5773BB]/10 overflow-hidden"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d931.8435183113835!2d-89.58465633065327!3d21.01495763677649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f567726c5f5220d%3A0x3da0ddfb0de71cd1!2sRenal%20-%20Hemodi%C3%A1lisis%20Cl%C3%ADnica%20de%20Ri%C3%B1%C3%B3n%20y%20trasplante%20renal!5e0!3m2!1ses!2smx!4v1708487800790!5m2!1ses!2smx"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de RENALSTAR PENINSULAR"
                className="rounded-2xl"
              />
            </motion.div>

            <motion.a
              href="https://www.google.com/maps/dir//Renal+-+Hemodi%C3%A1lisis+Cl%C3%ADnica+de+Ri%C3%B1%C3%B3n+y+trasplante+renal/@21.0149576,-89.5846563,19z/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-8 py-4 bg-gradient-to-r from-[#5773BB] to-[#4466B7] hover:from-[#4466B7] hover:to-[#5773BB] text-white font-sans font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaMapMarkedAlt className="w-5 h-5 mr-2" />
              Cómo Llegar
            </motion.a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Container2; 