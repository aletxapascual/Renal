import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { products } from '../../data/products';

function Container2() {
  const { language } = useLanguage();
  const [sortOrder, setSortOrder] = useState('default');
  const navigate = useNavigate();

  const productsList = Object.values(products);
  
  const sortedProducts = [...productsList].sort((a, b) => {
    if (sortOrder === 'default') {
      return 0;
    }
    return 0; // default order
  });

  const getProductImage = (product) => {
    if (product.flavors) {
      const defaultFlavor = product.flavors.find(f => f.id === product.defaultFlavor);
      return defaultFlavor.images[0];
    }
    return product.images[0];
  };

  const handleProductClick = (productId) => {
    window.scrollTo(0, 0);
    navigate(`/tienda/${productId}`);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-white via-[#5773BB]/5 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-5xl font-bold text-[#5773BB]">
            {language === 'es' ? 'Nuestros Productos' : 'Our Products'}
          </h2>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="default">
              {language === 'es' ? 'Ordenar por' : 'Sort by'}
            </option>
          </select>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sortedProducts.map((product) => (
              <motion.div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => handleProductClick(product.id)}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 bg-gray-50 p-6 flex items-center justify-center">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-48 object-contain"
                    />
                  </div>

                  <div className="flex flex-col flex-grow space-y-4 p-6">
                    <h3 className="text-3xl font-bold text-[#5773BB]">{product.name}</h3>
                    {product.flavors && (
                      <div className="flex flex-wrap gap-2">
                        {product.flavors.map(flavor => (
                          <span
                            key={flavor.id}
                            className="inline-block px-3 py-1 bg-[#5773BB]/10 text-[#5773BB] rounded-full text-sm font-medium"
                          >
                            {language === 'es' ? flavor.name.es : flavor.name.en}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-base text-gray-600 leading-relaxed flex-grow">
                      {language === 'es' ? product.shortDescription.es : product.shortDescription.en}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.scrollTo(0, 0);
                          navigate(`/tienda/${product.id}`);
                        }}
                        className="bg-[#00BFB3] hover:bg-[#00A89D] text-white transition-colors duration-300 font-medium text-lg flex items-center gap-2 px-6 py-2 rounded-lg shadow-sm hover:shadow-md"
                      >
                        {language === 'es' ? 'Ver Detalles' : 'View Details'}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Container2; 