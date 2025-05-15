import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';

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
        const q = query(collection(db, 'pedidos'), where('uid', '==', user?.uid));
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
          <div className="bg-white rounded-xl shadow p-6 space-y-2">
            <p><b>ID:</b> {pedidoActual.id}</p>
            <p><b>Fecha:</b> {pedidoActual.fecha}</p>
            <p><b>Total:</b> MXN {pedidoActual.total}</p>
            <p><b>Estado:</b> {pedidoActual.estado}</p>
            <p><b>Lugar de recolección:</b> {pedidoActual.lugarRecogida}</p>
            <p className="mt-4 font-medium">Productos:</p>
            <ul className="list-disc list-inside text-sm">
              {pedidoActual.productos?.map((prod, i) => (
                <li key={i}>
                  {prod.nombre} — {prod.cantidad} x MXN {prod.precio}
                  {prod.sabor && <span className="ml-2 text-gray-500">(Sabor: {prod.sabor})</span>}
                </li>
              ))}
            </ul>
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
          <table className="w-full text-left bg-white rounded-xl shadow overflow-hidden">
            <thead>
              <tr className="bg-[#5773BB]/10 text-[#5773BB]">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidosPasados.map((p) => (
                <tr key={p.id} className="border-b last:border-none">
                  <td className="py-2 px-4">{p.id}</td>
                  <td className="py-2 px-4">{p.fecha}</td>
                  <td className="py-2 px-4">MXN {p.total}</td>
                  <td className="py-2 px-4">{p.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No tienes pedidos anteriores.</p>
        )}
      </div>
    </div>
  );
}
