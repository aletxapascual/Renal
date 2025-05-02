import React, { createContext, useContext, useState } from 'react';

const storeLocations = [
  {
    name: 'Renal - Hemodiálisis Clínica de Riñón y trasplante renal',
    address: 'Calle 26 No.202 Int. 5, 6 Y 7 Plaza las Brisas, 97130 Mérida, Yuc.',
    availability: 'Disponible para recoger',
    map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d931.8435183113835!2d-89.58465633065327!3d21.01495763677649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f567726c5f5220d%3A0x3da0ddfb0de71cd1!2sRenal%20-%20Hemodi%C3%A1lisis%20Cl%C3%ADnica%20de%20Ri%C3%B1%C3%B3n%20y%20trasplante%20renal!5e0!3m2!1ses!2smx!4v1708487800790!5m2!1ses!2smx',
  },
  {
    name: 'Star Médica, Col. Altabrisa',
    address: 'Calle 20 No. 123, Col. Altabrisa, 97130 Mérida, Yuc.',
    availability: 'Disponible para recoger',
    map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.073282444442!2d-89.5875506!3d21.0162088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f56772129c11e79%3A0x5b922d04a0c4a8d5!2sStar%20M%C3%A9dica%2C%20Col.%20Altabrisa%2C%2097130%20M%C3%A9rida%2C%20Yuc.!5e0!3m2!1ses!2smx!4v1718040000000!5m2!1ses!2smx',
  },
  {
    name: 'Cenit Medical Center',
    address: 'Calle 32 No. 456, Col. Montecristo, 97133 Mérida, Yuc.',
    availability: 'Disponible para recoger',
    map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.073282444442!2d-89.5897396!3d21.0180001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f5677e2e2e2e2e2%3A0x9f56d95d08f21021!2sCenit%20Medical%20Center!5e0!3m2!1ses!2smx!4v1718040000001!5m2!1ses!2smx',
  },
];

const PickupModalContext = createContext();

export function usePickupModal() {
  return useContext(PickupModalContext);
}

export function PickupModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  const openPickupModal = () => setIsOpen(true);
  const closePickupModal = () => {
    setIsOpen(false);
    setSelectedStore(null);
  };

  // Helper to get the selected store's map URL
  const selectedMapUrl = selectedStore !== null ? storeLocations[selectedStore].map : storeLocations[0].map;

  return (
    <PickupModalContext.Provider value={{ isOpen, openPickupModal, closePickupModal, selectedStore, setSelectedStore, storeLocations }}>
      {children}
      {/* Modal rendering */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full p-8 relative animate-fadeIn flex flex-col">
            <button
              className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700"
              onClick={closePickupModal}
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
                  </label>
                ))}
                <button
                  className={`mt-2 w-full py-3 px-6 rounded-lg font-bold text-white text-lg ${selectedStore !== null ? 'bg-[#5773BB] hover:bg-[#4466B7]' : 'bg-gray-300 cursor-not-allowed'}`}
                  disabled={selectedStore === null}
                  onClick={closePickupModal}
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PickupModalContext.Provider>
  );
} 