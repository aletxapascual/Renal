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
      value: '+52 999 406 0838',
      href: 'tel:+529994060838'
    },
    {
      icon: FaEnvelope,
      label: 'Email',
      value: 'contacto@renalstarpeninsular.com',
      href: 'mailto:contacto@renalstarpeninsular.com'
    },
    {
      icon: FaMapMarkerAlt,
      label: 'Ubicación',
      value: 'Calle 7 #279 x 38 y 40\nCol. Campestre\nMérida, Yucatán'
    },
    {
      icon: FaClock,
      label: 'Horario',
      value: 'Lunes a Viernes: 7:00 AM - 7:00 PM\nSábado: 7:00 AM - 2:00 PM'
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
    <div className="bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl font-bold text-[#235AA7] mb-6"
            >
              ¿Cómo podemos ayudarte?
            </motion.h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300
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
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-300
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
                className={`w-full bg-[#235AA7] text-white font-medium py-3 px-6 rounded-xl
                  transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg
                  flex items-center justify-center space-x-2
                  ${isSubmitting ? 'opacity-75 cursor-wait' : 'hover:bg-[#4466B7]'}
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
            className="bg-[#1E293B] text-white p-8 rounded-2xl"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl font-bold mb-6"
            >
              ¿Necesitas ayuda?
            </motion.h2>
            
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.label}
                  variants={itemVariants}
                >
                  {info.href ? (
                    <a
                      href={info.href}
                      className="flex items-center space-x-4 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <div className="bg-[#5773BB] p-3 rounded-full transform transition-transform duration-300 group-hover:scale-110">
                        <info.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">{info.label}</p>
                        <p className="text-xl whitespace-pre-line">{info.value}</p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center space-x-4 p-3 rounded-xl">
                      <div className="bg-[#5773BB] p-3 rounded-full">
                        <info.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">{info.label}</p>
                        <p className="text-xl whitespace-pre-line">{info.value}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Map */}
            <motion.div
              variants={itemVariants}
              className="mt-6 rounded-xl overflow-hidden h-[300px]"
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
              />
            </motion.div>

            {/* Get Directions Button */}
            <motion.a
              href="https://www.google.com/maps/dir//Renal+-+Hemodi%C3%A1lisis+Cl%C3%ADnica+de+Ri%C3%B1%C3%B3n+y+trasplante+renal/@21.0149576,-89.5846563,19z/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center space-x-2 bg-[#5773BB] hover:bg-[#4466B7] p-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaMapMarkedAlt className="w-5 h-5" />
              <span>Cómo Llegar</span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Container2; 