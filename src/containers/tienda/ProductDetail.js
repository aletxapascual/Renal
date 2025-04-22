import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useParams, Navigate } from 'react-router-dom';
import { products } from '../../data/products';

function ProductDetail() {
  const { language } = useLanguage();
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState(null);
  const [mainImage, setMainImage] = useState(0);
  const [images, setImages] = useState([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0, xPercent: 0, yPercent: 0 });

  const product = products[productId];

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

  // If product doesn't exist, redirect to shop page
  if (!product) {
    return <Navigate to="/tienda" replace />;
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

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

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate the percentage position
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    setZoomPosition({ x, y, xPercent, yPercent });
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-white via-[#5773BB]/5 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Image Gallery */}
          <div className="lg:w-1/2 space-y-6">
            {images.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-sm p-8 aspect-square relative"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={images[mainImage]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
                <button 
                  className="absolute top-4 right-4 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors duration-300"
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5773BB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                {images.length > 1 && (
                  <>
                    <button 
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors duration-300"
                      onClick={() => setMainImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5773BB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button 
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors duration-300"
                      onClick={() => setMainImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5773BB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
                {isZoomed && (
                  <div 
                    className="absolute w-48 h-48 border-2 border-white pointer-events-none overflow-hidden"
                    style={{
                      left: `${zoomPosition.x}px`,
                      top: `${zoomPosition.y}px`,
                      transform: 'translate(-50%, -50%)',
                      backgroundImage: `url(${images[mainImage]})`,
                      backgroundSize: '400%',
                      backgroundPosition: `${zoomPosition.xPercent}% ${zoomPosition.yPercent}%`,
                      boxShadow: '0 0 10px rgba(0,0,0,0.3)',
                    }}
                  />
                )}
              </motion.div>
            )}
            
            {images.length > 1 && (
              <div className="relative">
                <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                  {images.map((image, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      onClick={() => setMainImage(index)}
                      className={`flex-shrink-0 w-24 h-24 bg-white rounded-lg p-2 border-2 transition-all duration-300 ${
                        mainImage === index ? 'border-[#5773BB] shadow-lg' : 'border-transparent hover:border-[#5773BB]/50'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </motion.button>
                  ))}
                </div>
                <button 
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors duration-300"
                  onClick={() => {
                    const container = document.querySelector('.scrollbar-hide');
                    container.scrollLeft -= 100;
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5773BB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors duration-300"
                  onClick={() => {
                    const container = document.querySelector('.scrollbar-hide');
                    container.scrollLeft += 100;
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5773BB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-[#5773BB] mb-4">{product.name}</h1>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-[#00BFB3]">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">{product.originalPrice}</span>
                )}
              </div>
            </div>

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

            <p className="text-gray-600 leading-relaxed">
              {language === 'es' ? product.description.es : product.description.en}
            </p>

            <div className="py-6 border-t border-b border-gray-100">
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-4 py-2 text-[#5773BB] hover:text-[#00BFB3] transition-colors duration-300"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-200">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-4 py-2 text-[#5773BB] hover:text-[#00BFB3] transition-colors duration-300"
                  >
                    +
                  </button>
                </div>
                <button className="bg-[#00BFB3] hover:bg-[#00A89D] text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  {language === 'es' ? 'Agregar al Carrito' : 'Add to Cart'}
                </button>
                <a 
                  href={`/fichasTecnicas/${productId}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#5773BB] hover:bg-[#4466B7] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {language === 'es' ? 'Ficha Técnica' : 'Technical Sheet'}
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00BFB3]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
                {language === 'es' ? 'Envío Gratis' : 'Free Shipping'}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00BFB3]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
                {language === 'es' ? 'Pago Seguro' : 'Secure Payment'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail; 