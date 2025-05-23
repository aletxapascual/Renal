import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useParams, Navigate, Link } from 'react-router-dom';
import { products } from '../../data/products';
import { FaPaperPlane, FaStore } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export const storeLocations = [
  {
    name: 'Renal Clínica',
    address: 'Calle 26 No.202 Int. 5, 6 Y 7 Plaza las Brisas, 97130 Mérida, Yuc.',
    availability: 'Disponible para recoger',
    map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d931.8435183113835!2d-89.58465633065327!3d21.01495763677649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f567726c5f5220d%3A0x3da0ddfb0de71cd1!2sRenal%20-%20Hemodi%C3%A1lisis%20Cl%C3%ADnica%20de%20Ri%C3%B1%C3%B3n%20y%20trasplante%20renal!5e0!3m2!1ses!2smx!4v1708487800790!5m2!1ses!2smx',
    mapLink: 'https://maps.app.goo.gl/2E34iFDPZAcjeunK7',
  },
  {
    name: 'Star Médica, Col. Altabrisa',
    address: 'Calle 20 No. 123, Col. Altabrisa, 97130 Mérida, Yuc.',
    availability: 'Disponible para recoger',
    map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.073282444442!2d-89.5875506!3d21.0162088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f56772129c11e79%3A0x5b922d04a0c4a8d5!2sStar%20M%C3%A9dica%2C%20Col.%20Altabrisa%2C%2097130%20M%C3%A9rida%2C%20Yuc.!5e0!3m2!1ses!2smx!4v1718040000000!5m2!1ses!2smx',
    mapLink: 'https://maps.app.goo.gl/LNsgyq1MFATmL63n7',
  },
  {
    name: 'Cenit Medical Center',
    address: 'Calle 32 No. 456, Col. Montecristo, 97133 Mérida, Yuc.',
    availability: 'Disponible para recoger',
    map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.073282444442!2d-89.5897396!3d21.0180001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f5677e2e2e2e2e2%3A0x9f56d95d08f21021!2sCenit%20Medical%20Center!5e0!3m2!1ses!2smx!4v1718040000001!5m2!1ses!2smx',
    mapLink: 'https://maps.app.goo.gl/FJqUaPfP4omkxxs6A',
  },
];

function ProductDetail() {
  const { language } = useLanguage();
  const { productId } = useParams();
  const { addToCart, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState(null);
  const [mainImage, setMainImage] = useState(0);
  const [images, setImages] = useState([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0, xPercent: 0, yPercent: 0 });
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [address, setAddress] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [stock, setStock] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchStocks, setBranchStocks] = useState({});

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

  useEffect(() => {
    const checkStock = async () => {
      if (!selectedBranch) {
        setStock(null);
        return;
      }
      try {
        const inventarioRef = doc(db, 'inventario', selectedBranch);
        const inventarioSnap = await getDoc(inventarioRef);
        if (inventarioSnap.exists()) {
          const inventario = inventarioSnap.data();
          const productStock = inventario[product.id];
          if (productStock) {
            if (product.flavors && selectedFlavor) {
              setStock(productStock.flavors?.[selectedFlavor] ?? 0);
            } else {
              setStock(productStock.stock ?? 0);
            }
          } else {
            setStock(0);
          }
        } else {
          setStock(0);
        }
      } catch (error) {
        setStock(0);
      }
    };
    checkStock();
  }, [product, selectedBranch, selectedFlavor]);

  useEffect(() => {
    const fetchAllBranchStocks = async () => {
      const stocks = {};
      for (const loc of storeLocations) {
        const inventarioRef = doc(db, 'inventario', loc.name);
        const inventarioSnap = await getDoc(inventarioRef);
        if (inventarioSnap.exists()) {
          const inventario = inventarioSnap.data();
          const productStock = inventario[product.id];
          if (productStock) {
            if (product.flavors && selectedFlavor) {
              stocks[loc.name] = productStock.flavors?.[selectedFlavor] ?? 0;
            } else {
              stocks[loc.name] = productStock.stock ?? 0;
            }
          } else {
            stocks[loc.name] = 0;
          }
        } else {
          stocks[loc.name] = 0;
        }
      }
      setBranchStocks(stocks);
    };
    if (showAvailabilityModal) {
      fetchAllBranchStocks();
    }
  }, [showAvailabilityModal, product, selectedFlavor]);

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

  // Helper to get the selected store's map URL
  const selectedMapUrl = selectedStore !== null ? storeLocations[selectedStore].map : storeLocations[0].map;

  const handleAddToCart = async () => {
    if (!selectedBranch) {
      alert('Por favor, selecciona una sucursal para recoger tu pedido');
      return;
    }

    // Buscar el objeto flavor completo si aplica
    let flavorObj = null;
    if (product.flavors && selectedFlavor) {
      flavorObj = product.flavors.find(f => f.id === selectedFlavor) || null;
    }

    try {
      await addToCart(product, quantity, flavorObj, selectedBranch);
      openCart();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-white via-[#5773BB]/5 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/tienda"
          className="inline-flex items-center gap-2 text-[#5773BB] hover:text-[#4466B7] transition-colors duration-300 mb-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {language === 'es' ? 'Volver a Tienda' : 'Back to Shop'}
        </Link>
        <div className="flex flex-col lg:flex-row gap-12 items-stretch min-h-[500px]">
          {/* Image Gallery */}
          <div className="lg:w-1/2 flex flex-col h-full flex-1">
            {images.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-sm p-8 aspect-square relative h-full mb-10"
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
            )}
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 flex flex-col h-full flex-1">
            <div className="bg-white rounded-xl shadow-sm p-8 space-y-6 h-full flex flex-col">
              <h1 className="text-4xl font-bold text-[#5773BB] mb-4">{product.name}</h1>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-[#00BFB3]">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">{product.originalPrice}</span>
                )}
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

              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Stock disponible: {stock !== null ? stock : 'Cargando...'}
                  </span>
                  <select
                    value={selectedBranch || ''}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="">Selecciona una sucursal</option>
                    {storeLocations.map(store => (
                      <option key={store.name} value={store.name}>{store.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="px-4 py-2 text-[#5773BB] hover:text-[#00BFB3] transition-colors duration-300 disabled:opacity-50"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={stock || 1}
                      value={quantity}
                      onChange={e => {
                        let val = parseInt(e.target.value, 10);
                        if (isNaN(val) || val < 1) val = 1;
                        if (stock && val > stock) val = stock;
                        setQuantity(val);
                      }}
                      className="px-4 py-2 border-x border-gray-200 w-16 text-center"
                    />
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= (stock || 0)}
                      className="px-4 py-2 text-[#5773BB] hover:text-[#00BFB3] transition-colors duration-300 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedBranch || stock === 0 || quantity > (stock || 0)}
                    className="flex-1 bg-[#5773BB] text-white font-bold py-3 rounded-lg hover:bg-[#4466B7] transition-all duration-300 disabled:opacity-50"
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>

              {/* Recoger en tienda as a plain row, at the bottom, left-aligned, font color matches product info */}
              <div className="flex items-center py-2 text-gray-600">
                <FaStore className="text-2xl text-[#5773BB] mr-3" />
                <span className="font-medium">Recoger en tienda</span>
              </div>

              {product.fichaTecnica && (
                <div className="flex items-center py-2 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5773BB] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7V3a1 1 0 011-1h8a1 1 0 011 1v4m-2 4h2a2 2 0 012 2v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7a2 2 0 012-2h2m4 0V3m0 4v4" />
                  </svg>
                  <a
                    href={product.fichaTecnica}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:text-[#4466B7] transition-colors"
                  >
                    Ver ficha técnica
                  </a>
                </div>
              )}

              {/* After the branch selector, show the Google Maps for the selected branch */}
              {selectedBranch && (
                <div className="mt-4 w-full flex justify-center">
                  <iframe
                    src={storeLocations.find(loc => loc.name === selectedBranch)?.map}
                    width="100%"
                    height="250"
                    style={{ border: 0, borderRadius: '12px', minHeight: '200px' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Mapa de ${selectedBranch}`}
                    className="w-full max-w-xl"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Encuentra tu tienda */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full p-8 relative animate-fadeIn flex flex-col">
            <button
              className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700"
              onClick={() => {
                setShowAvailabilityModal(false);
                setSubmitted(false);
                setAddress('');
                setSelectedStore(null);
              }}
              aria-label="Cerrar"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold mb-6 text-[#5773BB]">Encuentra tu tienda</h2>
            <div className="flex flex-col md:flex-row gap-6 w-full">
              {/* Map Section */}
              <div className="flex-1 rounded-xl overflow-hidden border border-gray-200 h-[340px]">
                <iframe
                  src={selectedMapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '340px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa de sucursales"
                  className="w-full h-full"
                />
              </div>
              {/* Locations List */}
              <div className="flex-1 flex flex-col gap-4 max-h-[340px] overflow-y-auto justify-start">
                {storeLocations.map((store, idx) => (
                  <label
                    key={store.name}
                    className={`block rounded-xl border-2 p-4 cursor-pointer transition-all ${selectedStore === idx ? 'border-[#5773BB] bg-[#f0f6ff]' : 'border-gray-200 bg-[#fafbfc] hover:border-[#5773BB]/50'}`}
                  >
                    <input
                      type="radio"
                      name="store"
                      className="mr-3 accent-[#5773BB]"
                      checked={selectedStore === idx}
                      onChange={() => setSelectedStore(idx)}
                    />
                    <span className="font-bold text-[#5773BB] block mb-1">{store.name}</span>
                    <span className="block text-gray-700 text-sm mb-1">{store.address}</span>
                    <span className="block text-gray-500 text-xs">{store.availability}</span>
                    <span className="block text-sm mt-1 font-semibold text-[#5773BB]">Stock: {branchStocks[store.name] ?? '...'}</span>
                  </label>
                ))}
                <button
                  className={`mt-2 w-full py-3 px-6 rounded-lg font-bold text-white text-lg ${selectedStore !== null ? 'bg-[#5773BB] hover:bg-[#4466B7]' : 'bg-gray-300 cursor-not-allowed'}`}
                  disabled={selectedStore === null}
                  onClick={() => setShowAvailabilityModal(false)}
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProductDetail; 