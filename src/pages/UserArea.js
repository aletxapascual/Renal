import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { products as tiendaProducts } from '../data/products';

const ubicaciones = {
  'Renal - Hemodiálisis Clínica de Riñón y trasplante renal': {
    direccion: 'Calle 26 No.202 Int. 5, 6 Y 7 Plaza las Brisas, 97130 Mérida, Yuc.',
  },
  'Star Médica, Col. Altabrisa': {
    direccion: 'Calle 20 No. 123, Col. Altabrisa, 97130 Mérida, Yuc.',
  },
  'Cenit Medical Center': {
    direccion: 'Calle 32 No. 456, Col. Montecristo, 97133 Mérida, Yuc.',
  },
};

const getProductImage = (prod) => {
  // Soporta productos con 'nombre' o 'name' como string u objeto
  let prodName = '';
  if (prod.nombre && typeof prod.nombre === 'object' && prod.nombre !== null) {
    prodName = prod.nombre.es || prod.nombre.en || '';
  } else if (prod.nombre) {
    prodName = prod.nombre;
  } else if (prod.name && typeof prod.name === 'object' && prod.name !== null) {
    prodName = prod.name.es || prod.name.en || '';
  } else if (prod.name) {
    prodName = prod.name;
  }
  if (!prodName && prod.image) return prod.image;
  if (!prodName) return '/images/productos/default.png';
  // Buscar por nombre exacto (case-insensitive)
  const prodKey = Object.keys(tiendaProducts).find(
    key => tiendaProducts[key].name.toLowerCase() === prodName.toLowerCase()
  );
  if (prodKey) {
    const tiendaProd = tiendaProducts[prodKey];
    // Manejo robusto de sabor
    let saborKey = '';
    if (prod.sabor && typeof prod.sabor === 'object' && prod.sabor !== null) {
      saborKey = prod.sabor.es || prod.sabor.en || prod.sabor.name?.es || prod.sabor.name?.en || '';
    } else if (prod.sabor) {
      saborKey = prod.sabor;
    } else if (prod.flavor && typeof prod.flavor === 'object' && prod.flavor !== null) {
      saborKey = prod.flavor.es || prod.flavor.en || prod.flavor.name?.es || prod.flavor.name?.en || '';
    } else if (prod.flavor) {
      saborKey = prod.flavor;
    }
    if (tiendaProd.flavors && saborKey) {
      const flavor = tiendaProd.flavors.find(f => f.name.es.toLowerCase() === saborKey.toLowerCase() || f.name.en?.toLowerCase() === saborKey.toLowerCase());
      if (flavor && flavor.images && flavor.images.length > 0) {
        return flavor.images[0];
      }
    }
    // Si no, usar la primera imagen general
    if (tiendaProd.images && tiendaProd.images.length > 0) {
      return tiendaProd.images[0];
    }
  }
  // Si el producto tiene imagen propia, úsala
  if (prod.image) return prod.image;
  // Imagen por defecto
  return '/images/productos/default.png';
};

export default function UserArea() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await signOut(auth);
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        if (!user || !user.uid) return; // Espera a que user.uid exista
        const q = query(collection(db, 'pedidos'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const pedidosDB = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPedidos(pedidosDB);
      } catch (error) {
        console.error('Error al obtener pedidos:', error);
      } finally {
        setLoading(false);
      }
    };
    obtenerPedidos();
  }, [user]);

  // Mostrar todos los pedidos actuales (no entregados)
  const pedidosActuales = pedidos.filter(p => p.estado !== 'Entregado');
  const pedidosPasados = pedidos.filter(p => p.estado === 'Entregado');

  const estadoColor = (estado) => {
    if (!estado) return 'bg-gray-300 text-gray-700';
    if (estado.toLowerCase().includes('pendiente') || estado.toLowerCase().includes('proceso')) return 'bg-yellow-100 text-yellow-700';
    if (estado.toLowerCase().includes('entregado')) return 'bg-green-100 text-green-700';
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-10">
      {/* Header / Bienvenida */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#5773BB]">Hola, {user?.firstName} 👋</h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded-lg transition"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Pedido Actual */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Pedidos Actuales</h2>
        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : pedidosActuales.length > 0 ? (
          pedidosActuales.map((pedidoActual, idx) => (
            <div key={pedidoActual.id || idx} className="bg-white rounded-xl shadow p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-4 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${estadoColor(pedidoActual.estado)}`}>{pedidoActual.estado}</span>
                <span className="text-gray-500 text-sm">{pedidoActual.fecha ? pedidoActual.fecha.slice(0, 10) : ''}</span>
                <span className="text-gray-500 text-sm">ID: {pedidoActual.id}</span>
              </div>
              <div className="text-sm text-gray-700 mb-2 flex items-center gap-2">
                <b>Lugar de recolección:</b> {pedidoActual.lugarRecogida}
                {ubicaciones[pedidoActual.lugarRecogida] && (
                  <span className="ml-1 text-gray-500">{ubicaciones[pedidoActual.lugarRecogida].direccion}</span>
                )}
                {pedidoActual.lugarRecogida && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ubicaciones[pedidoActual.lugarRecogida]?.direccion || pedidoActual.lugarRecogida)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Ver en Google Maps
                  </a>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {pedidoActual.productos?.map((prod, i) => (
                  <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-lg p-2">
                    <img src={getProductImage(prod)} alt={prod.nombre || prod.name} className="w-16 h-16 object-contain rounded-lg border" />
                    <div className="flex-1">
                      <div className="font-semibold text-[#5773BB]">
                        {typeof prod.nombre === 'object'
                          ? prod.nombre.es || prod.nombre.en
                          : prod.nombre || (typeof prod.name === 'object' ? prod.name.es || prod.name.en : prod.name)}
                      </div>
                      {(prod.sabor || prod.flavor) && (
                        <div className="text-xs text-gray-500">
                          Sabor: {typeof prod.sabor === 'object'
                            ? prod.sabor.es || prod.sabor.en || prod.sabor.name?.es || prod.sabor.name?.en
                            : prod.sabor || (typeof prod.flavor === 'object' ? prod.flavor.es || prod.flavor.en || prod.flavor.name?.es || prod.flavor.name?.en : prod.flavor)}
                        </div>
                      )}
                      <div className="text-xs">Cantidad: {prod.cantidad || prod.quantity} x <span className="font-bold">MXN {prod.precio || prod.price}</span></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-right mt-4">
                <span className="font-bold text-lg text-[#00BFB3]">Total: MXN {pedidoActual.total}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No hay pedidos pendientes.</p>
        )}
      </div>

      {/* Pedidos Pasados */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Pedidos Pasados</h2>
        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : pedidosPasados.length > 0 ? (
          pedidosPasados.map((p, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-4 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${estadoColor(p.estado)}`}>{p.estado}</span>
                <span className="text-gray-500 text-sm">{p.fecha ? p.fecha.slice(0, 10) : ''}</span>
                <span className="text-gray-500 text-sm">ID: {p.id}</span>
              </div>
              <div className="text-sm text-gray-700 mb-2 flex items-center gap-2">
                <b>Lugar de recolección:</b> {p.lugarRecogida}
                {ubicaciones[p.lugarRecogida] && (
                  <span className="ml-1 text-gray-500">{ubicaciones[p.lugarRecogida].direccion}</span>
                )}
                {p.lugarRecogida && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ubicaciones[p.lugarRecogida]?.direccion || p.lugarRecogida)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Ver en Google Maps
                  </a>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {p.productos?.map((prod, i) => (
                  <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-lg p-2">
                    <img src={getProductImage(prod)} alt={prod.nombre || prod.name} className="w-16 h-16 object-contain rounded-lg border" />
                    <div className="flex-1">
                      <div className="font-semibold text-[#5773BB]">
                        {typeof prod.nombre === 'object'
                          ? prod.nombre.es || prod.nombre.en
                          : prod.nombre || (typeof prod.name === 'object' ? prod.name.es || prod.name.en : prod.name)}
                      </div>
                      {(prod.sabor || prod.flavor) && (
                        <div className="text-xs text-gray-500">
                          Sabor: {typeof prod.sabor === 'object'
                            ? prod.sabor.es || prod.sabor.en || prod.sabor.name?.es || prod.sabor.name?.en
                            : prod.sabor || (typeof prod.flavor === 'object' ? prod.flavor.es || prod.flavor.en || prod.flavor.name?.es || prod.flavor.name?.en : prod.flavor)}
                        </div>
                      )}
                      <div className="text-xs">Cantidad: {prod.cantidad || prod.quantity} x <span className="font-bold">MXN {prod.precio || prod.price}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No hay pedidos pasados.</p>
        )}
      </div>
    </div>
  );
}