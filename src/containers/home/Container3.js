import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import hemProtJuntos from '../../images/productos/hemProtJuntos.png';
import renNutJuntos from '../../images/productos/renNutJuntos.png';
import maloobtalImg from '../../images/productos/maloobtal.png';
import maloobtalProImg from '../../images/productos/maloobtalPro.png';

function Container3() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    window.scrollTo(0, 0);
    navigate(`/tienda/${productId}`);
  };

  const products = [
    {
      id: 'maloobtalPro',
      name: 'Maloobtal Pro',
      image: maloobtalProImg,
      description: {
        es: 'Simbiótico con Rhamnosus y Longum. Diseñado para pacientes en hemodiálisis con síntomas digestivos por uremia.',
        en: 'Symbiotic with Rhamnosus and Longum. Designed for hemodialysis patients with digestive symptoms from uremia.'
      }
    },
    {
      id: 'maloobtal',
      name: 'Maloobtal HCO3',
      image: maloobtalImg,
      description: {
        es: 'Bicarbonato de sodio en dosis práctica para corregir acidosis metabólica en pacientes con enfermedad renal crónica.',
        en: 'Sodium bicarbonate in practical doses to correct metabolic acidosis in patients with chronic kidney disease.'
      }
    },
    {
      id: 'hemprot',
      name: 'HemProt',
      image: hemProtJuntos,
      description: {
        es: 'Suplemento alto en proteína a base de albúmina de huevo, ideal para pacientes en hemodiálisis. Bajo en sodio, fósforo y potasio.',
        en: 'High-protein supplement based on egg albumin, ideal for hemodialysis patients. Low in sodium, phosphorus and potassium.'
      }
    },
    {
      id: 'rennut',
      name: 'RenNut',
      image: renNutJuntos,
      description: {
        es: 'Suplemento con L-carnitina, bajo en proteína. Ideal para pacientes renales sin hemodiálisis que necesitan calorías sin sobrecargar el riñón.',
        en: 'Supplement with L-carnitine, low in protein. Ideal for renal patients without hemodialysis who need calories without overloading the kidney.'
      }
    }
  ];

  return (
    <div id="container3" className="relative py-24 bg-gradient-to-br from-white via-[#99AAD6]/30 to-[#99AAD6]/40">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#99AAD6]/30 to-transparent blur-3xl" />
        <div className="absolute top-20 -left-40 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#99AAD6]/30 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-20 w-[300px] h-[300px] rounded-full bg-gradient-to-tl from-[#99AAD6]/30 to-transparent blur-3xl" />
      </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div 
              key={product.id}
              className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 ring-1 ring-[#5773BB]/10 flex flex-col h-full"
            >
              <div className="aspect-[3/2] overflow-hidden bg-white p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-[#5773BB] mb-4 text-center">
                  {product.name}
                </h3>
                <p className="text-gray-700 mb-8 text-center flex-grow">
                  {product.description[language]}
                </p>
                {Array.isArray(product.flavors) && product.flavors.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {product.flavors.map((flavor, index) => {
                      if (!flavor || typeof flavor !== 'object' || !flavor.name || typeof flavor.name !== 'object' || typeof flavor.name.es !== 'string' || !flavor.name.es || typeof flavor.name.en !== 'string' || !flavor.name.en) return null;
                      return (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            flavor.name.es.toLowerCase().includes('vainilla')
                              ? 'bg-yellow-100 text-yellow-800'
                              : flavor.name.es.toLowerCase().includes('chocolate')
                              ? 'bg-[#8B4513]/20 text-[#8B4513]'
                              : flavor.name.es.toLowerCase().includes('fresa')
                              ? 'bg-pink-100 text-pink-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {language === 'es' ? flavor.name.es : flavor.name.en}
                        </span>
                      );
                    })}
                  </div>
                )}
                <button
                  onClick={() => handleProductClick(product.id)}
                  className="inline-flex items-center justify-center w-full px-6 py-4 text-base font-medium text-white bg-gradient-to-r from-[#5773BB] to-[#4466B7] hover:from-[#4466B7] hover:to-[#5773BB] rounded-full transition-colors duration-300"
                >
                  {language === 'es' ? 'Ver Detalles' : 'View Details'} 
                  <span className="ml-2">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Container3; 