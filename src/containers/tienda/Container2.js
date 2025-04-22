import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import maloobtalImg from '../../images/productos/maloobtal.png';
import hemProtImg from '../../images/productos/hemProtChocolate.png';
import renNutImg from '../../images/productos/renNutVainilla.png';

function Container2() {
  const { language } = useLanguage();

  const products = [
    {
      name: 'Maloobtal',
      description: language === 'es' 
        ? 'Suplemento con fibra soluble y probióticos que mejora la salud intestinal en pacientes renales.'
        : 'Supplement with soluble fiber and probiotics that improves intestinal health in renal patients.',
      price: '$850.00',
      image: maloobtalImg
    },
    {
      name: 'HemProt',
      description: language === 'es'
        ? 'Fórmula rica en proteína y nutrientes esenciales para mantener la masa muscular en pacientes con insuficiencia renal.'
        : 'Formula rich in protein and essential nutrients to maintain muscle mass in patients with renal insufficiency.',
      price: '$920.00',
      image: hemProtImg
    },
    {
      name: 'RenNut',
      description: language === 'es'
        ? 'Aporte equilibrado de fibra, carbohidratos y probióticos que apoya la digestión y el metabolismo renal.'
        : 'Balanced contribution of fiber, carbohydrates and probiotics that supports digestion and renal metabolism.',
      price: '$720.00',
      image: renNutImg
    }
  ];

  return (
    <section className="bg-gradient-to-br from-white via-[#5773BB]/5 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-xl text-[#5773BB] font-semibold">
            {language === 'es' 
              ? `Mostrando ${products.length} resultados`
              : `Showing all ${products.length} results`}
          </h2>
          <select className="border border-[#5773BB]/20 rounded-lg px-4 py-2 bg-white text-[#5773BB] font-medium focus:outline-none focus:border-[#5773BB]/40">
            <option>{language === 'es' ? 'Ordenar por defecto' : 'Default sorting'}</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/tienda/${product.name.toLowerCase()}`} className="block">
                <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-xl overflow-hidden aspect-square mb-6 transition-all duration-300 group-hover:shadow-lg">
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold text-[#5773BB]">{product.name}</h3>
                  <p className="text-base text-gray-600 leading-relaxed">{product.description}</p>
                  <p className="text-xl font-semibold text-[#00BFB3]">{product.price}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Container2; 