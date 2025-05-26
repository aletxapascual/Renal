import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useLoginModal } from '../context/LoginModalContext';
import logo from '../images/logo.png';
import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const { openLoginModal } = useLoginModal();
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path ? "text-blue-600 font-semibold scale-105" : "text-gray-700";

  const navLinks = [
    { path: "/", name: language === 'es' ? "Inicio" : "Home" },
    { path: "/acerca-de", name: language === 'es' ? "Acerca de" : "About" },
    { path: "/tienda", name: language === 'es' ? "Tienda" : "Shop" },
    { path: "/contacto", name: language === 'es' ? "Contacto" : "Contact" },
  ];

  const handleAccountRedirect = () => {
    if (user?.role === 'admin') {
      navigate('/dashboard');
    } else {
      navigate('/usuario');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

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
            <div className="flex items-center gap-4">
              {user?.role === 'admin' && (
                <Link
                  to="/dashboard"
                  className="text-[#5773BB] hover:text-[#4466B7] transition-colors"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-[#5773BB] hover:text-[#4466B7] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                {language === 'es' ? 'EN' : 'ES'}
              </button>
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="text-gray-700 hover:text-[#5773BB] transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              {language === 'es' ? 'EN' : 'ES'}
            </button>

            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none transition-transform duration-200 hover:scale-110">
              {!isOpen ? <FaBars className="h-7 w-7" /> : <FaTimes className="h-7 w-7" />}
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
            <button onClick={() => { setIsOpen(false); handleAccountRedirect(); }} className="w-full px-4 py-3 mt-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-lg font-medium rounded-full transition-colors duration-300">
              Mi cuenta
            </button>
          ) : (
            <button onClick={() => { openLoginModal(); setIsOpen(false); }} className="w-full px-4 py-3 mt-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-lg font-medium rounded-full transition-colors duration-300">
              Iniciar sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
