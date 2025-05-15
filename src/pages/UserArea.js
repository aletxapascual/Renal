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
  // Buscar por nombre exacto (case-insensitive)
  const prodKey = Object.keys(tiendaProducts).find(
    key => tiendaProducts[key].name.toLowerCase() === prod.nombre.toLowerCase()
  );
  if (prodKey) {
    const tiendaProd = tiendaProducts[prodKey];
    // Si tiene sabores y el pedido tiene sabor, buscar la imagen del sabor
    if (tiendaProd.flavors && prod.sabor) {
      const saborKey = prod.sabor.toLowerCase();
      const flavor = tiendaProd.flavors.find(f => f.name.es.toLowerCase() === saborKey || f.name.en?.toLowerCase() === saborKey);
      if (flavor && flavor.images && flavor.images.length > 0) {
        return flavor.images[0];
      }
    }
    // Si no, usar la primera imagen general
    if (tiendaProd.images && tiendaProd.images.length > 0) {
      return tiendaProd.images[0];
    }
  }
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
        const q = query(collection(db, 'pedidos'), where('email', '==', user?.username));
        const querySnapshot = await getDocs(q);
        const pedidosDB = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPedidos(pedidosDB);
      } catch (error) {
        console.error('Error al obtener pedidos:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) obtenerPedidos();
  }, [user]);

  const pedidoActual = pedidos.find(p => p.estado !== 'Entregado');
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
        <h2 className="text-xl font-semibold">Pedido Actual</h2>
        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : pedidoActual ? (
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-4 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${estadoColor(pedidoActual.estado)}`}>{pedidoActual.estado}</span>
              <span className="text-gray-500 text-sm">{pedidoActual.fecha}</span>
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
                  className="ml-2 text-blue-600 underline text-xs font-medium hover:text-blue-800"
                >
                  Ver en Google Maps
                </a>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {pedidoActual.productos?.map((prod, i) => (
                <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-lg p-2">
                  <img src={getProductImage(prod)} alt={prod.nombre} className="w-16 h-16 object-contain rounded-lg border" />
                  <div className="flex-1">
                    <div className="font-semibold text-[#5773BB]">{prod.nombre}</div>
                    {prod.sabor && <div className="text-xs text-gray-500">Sabor: {prod.sabor}</div>}
                    <div className="text-xs">Cantidad: {prod.cantidad} x <span className="font-bold">MXN {prod.precio}</span></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-right mt-4">
              <span className="font-bold text-lg text-[#00BFB3]">Total: MXN {pedidoActual.total}</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No tienes pedidos en proceso.</p>
        )}
      </div>

      {/* Historial de Pedidos */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Pedidos Pasados</h2>
        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : pedidosPasados.length > 0 ? (
          <div className="space-y-4">
            {pedidosPasados.map((p) => (
              <div key={p.id} className="bg-white rounded-xl shadow p-6 space-y-2">
                <div className="flex flex-wrap items-center gap-4 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${estadoColor(p.estado)}`}>{p.estado}</span>
                  <span className="text-gray-500 text-sm">{p.fecha}</span>
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
                      className="ml-2 text-blue-600 underline text-xs font-medium hover:text-blue-800"
                    >
                      Ver en Google Maps
                    </a>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {p.productos?.map((prod, i) => (
                    <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-lg p-2">
                      <img src={getProductImage(prod)} alt={prod.nombre} className="w-16 h-16 object-contain rounded-lg border" />
                      <div className="flex-1">
                        <div className="font-semibold text-[#5773BB]">{prod.nombre}</div>
                        {prod.sabor && <div className="text-xs text-gray-500">Sabor: {prod.sabor}</div>}
                        <div className="text-xs">Cantidad: {prod.cantidad} x <span className="font-bold">MXN {prod.precio}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-right mt-4">
                  <span className="font-bold text-lg text-[#00BFB3]">Total: MXN {p.total}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No tienes pedidos anteriores.</p>
        )}
      </div>
    </div>
  );
}
