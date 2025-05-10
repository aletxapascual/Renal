import React from 'react';
import { useAuth } from '../context/AuthContext';

// Pedidos simulados
const pedidos = [
  { id: 1, cliente: 'Juan Pérez', total: 1200, estado: 'Pendiente' },
  { id: 2, cliente: 'Ana López', total: 850, estado: 'Entregado' },
  { id: 3, cliente: 'Carlos Ruiz', total: 1500, estado: 'En camino' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#5773BB]">Dashboard Admin</h1>
        <button onClick={logout} className="bg-gray-200 px-4 py-2 rounded-lg">Cerrar sesión</button>
      </div>
      <h2 className="text-xl font-semibold mb-4">Todos los pedidos</h2>
      <table className="w-full bg-white rounded-xl shadow-md overflow-hidden">
        <thead>
          <tr className="bg-[#5773BB]/10 text-[#5773BB]">
            <th className="py-3 px-4 text-left">ID</th>
            <th className="py-3 px-4 text-left">Cliente</th>
            <th className="py-3 px-4 text-left">Total</th>
            <th className="py-3 px-4 text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(p => (
            <tr key={p.id} className="border-b last:border-none">
              <td className="py-2 px-4">{p.id}</td>
              <td className="py-2 px-4">{p.cliente}</td>
              <td className="py-2 px-4">MXN {p.total}</td>
              <td className="py-2 px-4">{p.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 