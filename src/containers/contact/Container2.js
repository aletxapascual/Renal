import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaMapMarkedAlt, FaClock, FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

function Container2() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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

  const handleWhatsAppRedirect = () => {
    const message = `Nombre: ${formData.name}%0AEmail: ${formData.email}%0AMensaje: ${formData.message}`;
    const whatsappUrl = `https://wa.me/529994511893?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Redirigir a WhatsApp
    handleWhatsAppRedirect();

    // Mostrar mensaje de éxito y limpiar formulario
    setTimeout(() => {
      setShowSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: FaPhone,
      label: language === 'es' ? 'Teléfono' : 'Phone',
      value: '999 930 6925',
      href: 'tel:9999306925'
    },
    {
      icon: FaEnvelope,
      label: 'Email',
      value: 'administracion@hemodialisis.com.mx',
      href: 'mailto:administracion@hemodialisis.com.mx'
    },
    {
      icon: FaMapMarkerAlt,
      label: language === 'es' ? 'Ubicación' : 'Location',
      value: language === 'es'
        ? 'Altabrisa, Calle 26 No.202 Int. 5\n97130 Mérida, Yuc.'
        : 'Altabrisa, 26th Street No.202 Int. 5\n97130 Mérida, Yuc.'
    },
    {
      icon: FaClock,
      label: language === 'es' ? 'Horario' : 'Hours',
      value: language === 'es' 
        ? 'Lunes a Viernes: 7:00 A.M. - 3:00 P.M.\nSábado: 7:00 A.M. - 1:00 P.M.'
        : 'Monday to Friday: 7:00 A.M. - 3:00 P.M.\nSaturday: 7:00 A.M. - 1:00 P.M.'
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

  const formFields = [
    {
      id: 'name',
      label: language === 'es' ? '¿Cuál es tu nombre?' : 'What is your name?',
      type: 'text',
      placeholder: language === 'es' ? 'Tu nombre' : 'Your name'
    },
    {
      id: 'email',
      label: language === 'es' ? '¿Cuál es tu correo electrónico?' : 'What is your email?',
      type: 'email',
      placeholder: language === 'es' ? 'correo@ejemplo.com' : 'email@example.com'
    }
  ];

  return (
    <div className="relative bg-gradient-to-br from-white via-[#5773BB]/10 to-[#5773BB]/20 py-12">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Formulario */}
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
            {language === 'es' ? '¿Cómo podemos ayudarte?' : 'How can we help you?'}
          </motion.h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {formFields.map(field => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-lg font-medium text-gray-700 mb-2">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
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
                  required
                />
              </div>
            ))}
            <div>
              <label htmlFor="message" className="block text-lg font-medium text-gray-700 mb-2">
                {language === 'es' ? '¿Tienes algún mensaje para nosotros?' : 'Do you have a message for us?'}
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
                placeholder={language === 'es' ? 'Escribe tu mensaje aquí...' : 'Write your message here...'}
                required
              />
            </div>
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
              <FaWhatsapp className="w-5 h-5 mr-2" />
              <span>{language === 'es' ? 'Enviar por WhatsApp' : 'Send via WhatsApp'}</span>
            </motion.button>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-600 text-center mt-4"
              >
                {language === 'es'
                  ? '¡Mensaje enviado con éxito! Te redirigimos a WhatsApp.'
                  : 'Message sent successfully! Redirecting you to WhatsApp.'}
              </motion.div>
            )}
          </form>
        </motion.div>
        {/* Información de contacto */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              variants={containerVariants}
              className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ring-1 ring-[#5773BB]/10 ${
                info.label === (language === 'es' ? 'Ubicación' : 'Location') 
                  ? 'p-4' 
                  : 'p-6'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gradient-to-br from-[#5773BB] to-[#4466B7] rounded-2xl text-white">
                  <info.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-sans text-xl font-bold bg-gradient-to-r from-[#5773BB] to-[#4466B7] bg-clip-text text-transparent mb-3">
                    {info.label}
                  </h4>
                  {info.href ? (
                    <a href={info.href} className="font-sans text-lg text-gray-600 leading-relaxed block">
                      {info.value}
                    </a>
                  ) : (
                    <p className="font-sans text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                      {info.value}
                    </p>
                  )}
                  {/* Botón de cómo llegar solo para ubicación */}
                  {info.label === (language === 'es' ? 'Ubicación' : 'Location') && (
                    <a
                      href="https://www.google.com/maps/place/Renal+-+Hemodiálisis+Clínica+de+Riñón+y+trasplante+renal/@21.014954,-89.584404,18z/data=!4m6!3m5!1s0x8f567726c5f5220d:0x3da0ddfb0de71cd1!8m2!3d21.0149535!4d-89.5844038!16s%2Fg%2F1tmplkmk?hl=es&entry=ttu&g_ep=EgoyMDI1MDQyMC4wIKXMDSoASAFQAw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-8 py-4 mt-4 bg-gradient-to-r from-[#5773BB] to-[#4466B7] hover:from-[#4466B7] hover:to-[#5773BB] text-white font-sans font-semibold rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                    >
                      <FaMapMarkedAlt className="w-5 h-5 mr-2" />
                      {language === 'es' ? 'Cómo Llegar' : 'Get Directions'}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Container2; 