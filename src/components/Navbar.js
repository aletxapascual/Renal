import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import logo from '../images/logo.png';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const { openCart } = useCart();
  const { user, login, logout } = useAuth();


  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path ? "text-blue-600 font-semibold scale-105" : "text-gray-700";

  const navLinks = [
    { path: "/", name: language === 'es' ? "Inicio" : "Home" },
    { path: "/acerca-de", name: language === 'es' ? "Acerca de" : "About" },
    { path: "/tienda", name: language === 'es' ? "Tienda" : "Shop" },
    { path: "/contacto", name: language === 'es' ? "Contacto" : "Contact" },
  ];

  return (
    <nav className={`bg-white shadow-sm fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'h-20 md:h-20' : 'h-32 md:h-32'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full transition-all duration-300">
          <div className="flex-shrink-0 w-1/2 md:w-1/4">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="Renal Logo"
                className={`object-contain transform hover:scale-105 transition-all duration-300 ${isScrolled ? 'h-16 w-auto md:h-16' : 'h-30 w-48 md:h-28 md:w-auto'}`}
              />
            </Link>
          </div>

          <div className="hidden md:flex md:flex-1 md:justify-center">
            <div className="flex items-center space-x-12">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} className={`${isActive(link.path)} text-base hover:text-blue-600 px-3 py-2 font-medium transition-all duration-300 ease-in-out transform hover:scale-105 relative group`}>
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <button onClick={toggleLanguage} className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
            </button>

            <button onClick={openCart} className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group" aria-label="Abrir carrito" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>

            {user ? (
              <button onClick={handleLogout} className="px-4 py-2 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-full text-sm font-medium transition-colors duration-300">
                Cerrar sesión
              </button>
            ) : (
              <Link to="/login" className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-full text-sm font-medium transition-colors duration-300">
                Iniciar sesión
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button onClick={toggleLanguage} className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
            </button>

            <button onClick={openCart} className="text-gray-700 hover:text-blue-600 transition-colors duration-200" aria-label="Abrir carrito" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>

            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none transition-transform duration-200 hover:scale-110">
              {!isOpen ? (
                <svg className="block h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden absolute w-full bg-white shadow-lg z-50 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} onClick={() => { setIsOpen(false); window.scrollTo(0, 0); }} className={`${isActive(link.path)} block text-center px-4 py-3 text-lg font-medium hover:text-blue-600 transition-all duration-300`}>
              {link.name}
            </Link>
          ))}

          {user ? (
            <button onClick={() => { setIsOpen(false); handleLogout(); }} className="w-full px-4 py-3 mt-2 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-lg font-medium rounded-full transition-colors duration-300">
              Cerrar sesión
            </button>
          ) : (
            <Link to="/login" className="flex items-center justify-center px-4 py-3 mt-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-lg font-medium transition-colors duration-300 mx-4 rounded-full" onClick={() => setIsOpen(false)}>
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
