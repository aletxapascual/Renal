import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import hemProtImg from '../../images/hemProt.png';
import renNutImg from '../../images/renNut.png';
import maloobtalImg from '../../images/maloobtal.png';

function Container3() {
  const { language } = useLanguage();

  const products = [
    {
      id: 'hemprot',
      name: 'HemProt',
      image: hemProtImg,
      description: language === 'es'
        ? 'Contribuye al mantenimiento y crecimiento muscular, proporcionando los nutrientes necesarios para la recuperación y el desarrollo muscular mediante una mezcla de proteínas y minerales esenciales.'
        : 'Contributes to muscle maintenance and growth, providing the necessary nutrients for muscle recovery and development through a blend of proteins and essential minerals.',
    },
    {
      id: 'rennut',
      name: 'RenNut',
      image: renNutImg,
      description: language === 'es'
        ? 'Enfocado en la combinación de prebióticos y probióticos para maximizar los beneficios digestivos, promueve una salud digestiva óptima, mejorando el tránsito intestinal y contribuyendo al bienestar general del intestino.'
        : 'Focused on combining prebiotics and probiotics to maximize digestive benefits, promotes optimal digestive health, improving intestinal transit and contributing to overall intestinal well-being.',
    },
    {
      id: 'maloobtal',
      name: 'Maloobtal',
      image: maloobtalImg,
      description: language === 'es'
        ? 'Diseñados para mejorar la salud digestiva y el bienestar intestinal, comparten el objetivo de promover una digestión saludable y eficiente, contribuyendo a un equilibrio óptimo en el sistema digestivo.'
        : 'Designed to improve digestive health and intestinal well-being, sharing the goal of promoting healthy and efficient digestion, contributing to optimal balance in the digestive system.',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-white via-[#5773BB]/5 to-[#5773BB]/10 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h4 className="text-[#5773BB] text-lg font-medium mb-4 bg-gradient-to-r from-[#5773BB] to-[#4466B7] bg-clip-text text-transparent">
            {language === 'es' ? 'Nuestros Productos' : 'Our Products'}
          </h4>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#5773BB] via-[#4466B7] to-[#5773BB] bg-clip-text text-transparent">
            {language === 'es' ? 'Suplementos Especializados' : 'Specialized Supplements'}
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            {language === 'es' 
              ? 'Desarrollados específicamente para complementar el tratamiento renal y mejorar la calidad de vida de nuestros pacientes.'
              : 'Specifically developed to complement renal treatment and improve the quality of life of our patients.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div 
              key={product.id}
              className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 ring-1 ring-[#5773BB]/10"
            >
              <div className="aspect-[4/3] overflow-hidden bg-white p-8">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-[#5773BB] mb-4">
                  {product.name}
                </h3>
                <p className="text-gray-700 mb-8">
                  {product.description}
                </p>
                <Link
                  to={`/productos/${product.id}`}
                  className="inline-flex items-center justify-center w-full px-6 py-4 text-base font-medium text-white bg-gradient-to-r from-[#5773BB] to-[#4466B7] hover:from-[#4466B7] hover:to-[#5773BB] rounded-full transition-colors duration-300"
                >
                  {language === 'es' ? 'Comprar Ahora' : 'Buy Now'} 
                  <span className="ml-2">🛒</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Container3; 