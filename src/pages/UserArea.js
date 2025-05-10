import React from 'react';
import { useAuth } from '../context/AuthContext';

// Pedidos simulados para el usuario
const pedidosActual = { id: 4, total: 950, estado: 'En proceso', fecha: '2024-06-10' };
const pedidosPasados = [
  { id: 2, total: 1200, estado: 'Entregado', fecha: '2024-05-20' },
  { id: 1, total: 800, estado: 'Entregado', fecha: '2024-04-15' },
];

export default function UserArea() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#5773BB]">Área de Usuario</h1>
        <button onClick={logout} className="bg-gray-200 px-4 py-2 rounded-lg">Cerrar sesión</button>
      </div>
      <h2 className="text-xl font-semibold mb-4">Pedido Actual</h2>
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <p><b>ID:</b> {pedidosActual.id}</p>
        <p><b>Fecha:</b> {pedidosActual.fecha}</p>
        <p><b>Total:</b> MXN {pedidosActual.total}</p>
        <p><b>Estado:</b> {pedidosActual.estado}</p>
      </div>
      <h2 className="text-xl font-semibold mb-4">Pedidos Pasados</h2>
      <table className="w-full bg-white rounded-xl shadow-md overflow-hidden">
        <thead>
          <tr className="bg-[#5773BB]/10 text-[#5773BB]">
            <th className="py-3 px-4 text-left">ID</th>
            <th className="py-3 px-4 text-left">Fecha</th>
            <th className="py-3 px-4 text-left">Total</th>
            <th className="py-3 px-4 text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {pedidosPasados.map(p => (
            <tr key={p.id} className="border-b last:border-none">
              <td className="py-2 px-4">{p.id}</td>
              <td className="py-2 px-4">{p.fecha}</td>
              <td className="py-2 px-4">MXN {p.total}</td>
              <td className="py-2 px-4">{p.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 