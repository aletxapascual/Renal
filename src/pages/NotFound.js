import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

function NotFound() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {language === 'es' ? '404 - Página no encontrada' : '404 - Page Not Found'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {language === 'es' 
              ? 'Lo sentimos, la página que estás buscando no existe.'
              : 'Sorry, the page you are looking for does not exist.'}
          </p>
        </div>
        <div>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-[#5773BB] hover:bg-[#4466B7]"
          >
            {language === 'es' ? 'Volver al inicio' : 'Back to Home'}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound; 