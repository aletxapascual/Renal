import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { products } from '../data/products';
import { motion } from 'framer-motion';

function ProductPage() {
  const { id } = useParams();
  const { language } = useLanguage();
  const product = products[id];
  const [selectedFlavor, setSelectedFlavor] = useState(null);
  const [mainImage, setMainImage] = useState(0);
  const [images, setImages] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      // Initialize selected flavor
      setSelectedFlavor(product.defaultFlavor || null);
      
      // Initialize images
      if (product.flavors) {
        const defaultFlavor = product.flavors.find(f => f.id === product.defaultFlavor) || product.flavors[0];
        setImages(defaultFlavor.images);
      } else {
        setImages(product.images);
      }
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl text-gray-600">
          {language === 'es' ? 'Producto no encontrado' : 'Product not found'}
        </h1>
      </div>
    );
  }

  const handleFlavorChange = (flavorId) => {
    setSelectedFlavor(flavorId);
    setMainImage(0);
    if (product.flavors) {
      const flavor = product.flavors.find(f => f.id === flavorId);
      if (flavor) {
        setImages(flavor.images);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#5773BB]/5 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Images Section */}
          <div className="space-y-8">
            {images.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <img
                  src={images[mainImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => setMainImage(index)}
                    className={`aspect-square bg-white rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      mainImage === index ? 'border-[#5773BB] shadow-lg' : 'border-transparent hover:border-[#5773BB]/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <h1 className="text-4xl font-bold text-[#5773BB]">{product.name}</h1>
            <p className="text-3xl font-bold text-[#00BFB3]">{product.price}</p>
            
            {product.flavors && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  {language === 'es' ? 'Seleccionar Sabor' : 'Select Flavor'}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.flavors.map(flavor => (
                    <button
                      key={flavor.id}
                      onClick={() => handleFlavorChange(flavor.id)}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                        selectedFlavor === flavor.id
                          ? 'bg-[#5773BB] text-white shadow-lg'
                          : 'bg-[#5773BB]/10 text-[#5773BB] hover:bg-[#5773BB]/20'
                      }`}
                    >
                      {language === 'es' ? flavor.name.es : flavor.name.en}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="prose prose-lg">
              <p className="text-gray-600">
                {language === 'es' ? product.description.es : product.description.en}
              </p>
            </div>

            <div className="flex flex-col space-y-6">
              <div className="flex flex-col space-y-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-2">
                    <label className="text-lg font-medium text-gray-700">
                      {language === 'es' ? 'Cantidad:' : 'Quantity:'}
                    </label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-24 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5773BB]"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <button className="w-full bg-[#00BFB3] hover:bg-[#00A89D] text-white transition-colors duration-300 font-medium text-lg flex items-center justify-center gap-3 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl">
                    {language === 'es' ? 'Agregar al Carrito' : 'Add to Cart'}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                  </button>
                  <button className="w-full bg-[#5773BB] hover:bg-[#4A63A0] text-white transition-colors duration-300 font-medium text-lg flex items-center justify-center gap-3 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl">
                    {language === 'es' ? 'Ficha Técnica' : 'Technical Sheet'}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage; 