import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [pedidoActivo, setPedidoActivo] = useState(null);

  useEffect(() => {
    const obtenerPedidos = async () => {
      const q = await getDocs(collection(db, 'pedidos'));
      const pedidosDB = await Promise.all(
        q.docs.map(async (d) => {
          const pedido = { id: d.id, ...d.data() };
  
          const uid = d.data().uid;
  
          if (uid) {
            const clienteRef = doc(db, 'users', uid);
            const clienteSnap = await getDoc(clienteRef);
            if (clienteSnap.exists()) {
              pedido.cliente = clienteSnap.data();
            } else {
              pedido.cliente = { email: pedido.email };
            }
          } else {
            pedido.cliente = { email: pedido.email };
          }
  
          return pedido;
        })
      );
      setPedidos(pedidosDB);
    };
  
    obtenerPedidos();
  }, []);
  

  const handleEstadoChange = async (id, nuevoEstado) => {
    const ref = doc(db, 'pedidos', id);
    await updateDoc(ref, { estado: nuevoEstado });
    setPedidos(pedidos.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
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
            <React.Fragment key={p.id}>
              <tr
                className="border-b last:border-none cursor-pointer hover:bg-gray-50"
                onClick={() => setPedidoActivo(pedidoActivo?.id === p.id ? null : p)}
              >
                <td className="py-2 px-4">{p.id}</td>
                <td className="py-2 px-4">{p.cliente?.firstName || ''} {p.cliente?.lastName || ''}</td>
                <td className="py-2 px-4">MXN {p.total}</td>
                <td className="py-2 px-4">{p.estado}</td>
              </tr>
              {pedidoActivo?.id === p.id && (
                <tr>
                  <td colSpan="4" className="bg-gray-50 px-4 py-6">
                    <div className="space-y-2">
                      <p><b>Correo:</b> {p.cliente?.email}</p>
                      <p><b>Fecha:</b> {p.fecha}</p>
                      <p><b>Total:</b> MXN {p.total}</p>
                      <p><b>Lugar de recogida:</b> {p.lugarRecogida}</p>
                      <div>
                        <p className="font-semibold">Productos:</p>
                        <ul className="list-disc list-inside ml-4">
                          {p.productos?.map((prod, i) => (
                            <li key={i}>
                              {prod.nombre} — {prod.cantidad} x MXN {prod.precio}
                              {prod.sabor && <span className="ml-2 text-gray-500">(Sabor: {prod.sabor})</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-4">
                        <label className="font-semibold mr-2">Cambiar estado:</label>
                        <select
                          value={p.estado}
                          onChange={(e) => handleEstadoChange(p.id, e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-1"
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="En proceso">En proceso</option>
                          <option value="En camino">En camino</option>
                          <option value="Entregado">Entregado</option>
                        </select>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
