import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import logo from '../images/logo.png';

function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="bg-[#235AA7] text-white">
      {/* Top banner with phone */}
      <div className="bg-[#00BFB3] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">
              {language === 'es' ? '¿TIENES ALGUNA PREGUNTA?' : 'DO YOU HAVE A QUESTION?'}
            </span>
            <a 
              href="tel:9999255435" 
              className="text-white text-lg font-bold hover:text-white/90 transition-colors"
            >
              (999) 925 5435
            </a>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <img 
              src={logo} 
              alt="Renal Logo" 
              className="h-16 mb-6"
            />
            <p className="text-white/80 text-sm leading-relaxed">
              {language === 'es' 
                ? 'En Renal nos dedicamos a brindar servicios de hemodiálisis con un enfoque humano y tecnología de vanguardia, proporcionando atención más allá de la medicina.'
                : 'At Renal, we are dedicated to providing hemodialysis services with a human approach and cutting-edge technology, providing care beyond medicine.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="hidden md:block">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'es' ? 'Enlaces Rápidos' : 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/80 hover:text-white transition-colors">
                  {language === 'es' ? 'Inicio' : 'Home'}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/80 hover:text-white transition-colors">
                  {language === 'es' ? 'Nosotros' : 'About'}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-white/80 hover:text-white transition-colors">
                  {language === 'es' ? 'Servicios' : 'Services'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-white transition-colors">
                  {language === 'es' ? 'Contacto' : 'Contact'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {language === 'es' ? 'Servicios' : 'Services'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services/hemodialysis" className="text-white/80 hover:text-white transition-colors">
                  {language === 'es' ? 'Hemodiálisis' : 'Hemodialysis'}
                </Link>
              </li>
              <li>
                <Link to="/services/supplements" className="text-white/80 hover:text-white transition-colors">
                  {language === 'es' ? 'Suplementos' : 'Supplements'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {language === 'es' ? 'Contacto' : 'Contact Us'}
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">
                  {language === 'es' ? 'Dirección' : 'Address'}
                </h4>
                <p className="text-white/80 text-sm">
                  Calle 7 #338, entre 42 y 44<br />
                  Col. García Ginerés<br />
                  Mérida, Yucatán, México<br />
                  C.P. 97070
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Email</h4>
                <a 
                  href="mailto:contacto@renalstar.com" 
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  contacto@renalstar.com
                </a>
              </div>
              <div>
                <h4 className="font-medium mb-1">
                  {language === 'es' ? 'Teléfono' : 'Phone'}
                </h4>
                <a 
                  href="tel:9999255435" 
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  (999) 925 5435
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-white/60 text-sm">
            © {new Date().getFullYear()} Renal. 
            {language === 'es' 
              ? ' Todos los derechos reservados.'
              : ' All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 