import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { products } from '../../data/products';

function Container2() {
  const { language } = useLanguage();
  const [sortOrder, setSortOrder] = useState('default');
  const navigate = useNavigate();

  const productsList = Object.values(products);
  
  const sortedProducts = [...productsList].sort((a, b) => {
    const priceA = parseFloat(a.price.replace('$', ''));
    const priceB = parseFloat(b.price.replace('$', ''));
    
    if (sortOrder === 'ascending') {
      return priceA - priceB;
    } else if (sortOrder === 'descending') {
      return priceB - priceA;
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
    <section className="bg-gradient-to-br from-white via-[#5773BB]/5 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-16">
          <h2 className="text-2xl text-[#5773BB] font-bold">
            {language === 'es' 
              ? `Mostrando ${productsList.length} resultados`
              : `Showing all ${productsList.length} results`}
          </h2>
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-[#5773BB]/20 rounded-lg px-4 py-2 bg-white text-[#5773BB] font-medium focus:outline-none focus:border-[#5773BB]/40 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <option value="default">{language === 'es' ? 'Ordenar por defecto' : 'Default sorting'}</option>
            <option value="ascending">{language === 'es' ? 'Precio: Menor a Mayor' : 'Price: Low to High'}</option>
            <option value="descending">{language === 'es' ? 'Precio: Mayor a Menor' : 'Price: High to Low'}</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {sortedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 h-full flex flex-col border border-gray-100">
                <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-xl overflow-hidden aspect-[3/2] mb-8 transition-all duration-300 group-hover:shadow-lg">
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div className="flex flex-col flex-grow space-y-4">
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
                    {language === 'es' ? product.description.es : product.description.en}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <p className="text-2xl font-bold text-[#00BFB3]">{product.price}</p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.scrollTo(0, 0);
                        navigate(`/tienda/${product.id}`);
                      }}
                      className="bg-[#00BFB3] hover:bg-[#00A89D] text-white transition-colors duration-300 font-medium text-lg flex items-center gap-2 px-6 py-2 rounded-lg shadow-sm hover:shadow-md"
                    >
                      {language === 'es' ? 'Comprar Ahora' : 'Buy Now'}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Container2; 