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
    <div className="relative bg-gradient-to-br from-white to-[#5773BB]/10">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center text-[#235AA7] mb-12">
          {language === 'es' ? 'Nuestros Suplementos' : 'Our Supplements'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div 
              key={product.id}
              className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-[#4466B7]/10"
            >
              <div className="aspect-w-1 aspect-h-1 mb-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-contain rounded-lg"
                />
              </div>
              
              <h3 className="text-2xl font-semibold text-[#235AA7] mb-4">
                {product.name}
              </h3>
              
              <p className="text-gray-600 mb-6 min-h-[120px]">
                {product.description}
              </p>
              
              <Link
                to={`/productos/${product.id}`}
                className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white bg-[#235AA7] hover:bg-[#4466B7] rounded-full transition-colors duration-300"
              >
                {language === 'es' ? 'Comprar Ahora' : 'Buy Now'} 
                <span className="ml-2">🛒</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Container3; 