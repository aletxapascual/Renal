import React from 'react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

// Simulación de pedidos
const pedidosActual = {
  id: 4,
  total: 950,
  estado: 'En proceso',
  fecha: '2024-06-10',
};

const pedidosPasados = [
  { id: 2, total: 1200, estado: 'Entregado', fecha: '2024-05-20' },
  { id: 1, total: 800, estado: 'Entregado', fecha: '2024-04-15' },
];

export default function UserArea() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-10">

      {/* Header / Bienvenida */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#5773BB]">Hola, {user?.firstName}  👋</h1>
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
        {pedidosActual ? (
          <div className="bg-white rounded-xl shadow p-6 space-y-2">
            <p><b>ID:</b> {pedidosActual.id}</p>
            <p><b>Fecha:</b> {pedidosActual.fecha}</p>
            <p><b>Total:</b> MXN {pedidosActual.total}</p>
            <p><b>Estado:</b> {pedidosActual.estado}</p>
          </div>
        ) : (
          <p className="text-gray-500">No tienes pedidos en proceso.</p>
        )}
      </div>

      {/* Historial de Pedidos */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Pedidos Pasados</h2>
        {pedidosPasados.length > 0 ? (
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
