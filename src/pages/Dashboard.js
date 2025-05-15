import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { products } from '../data/products';

const BRANCHES = [
  'Renal Clínica',
  'Star Médica, Col. Altabrisa',
  'Cenit Medical Center'
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [pedidoActivo, setPedidoActivo] = useState(null);
  const [activeTab, setActiveTab] = useState('pedidos');
  const [inventario, setInventario] = useState({});
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);
  
  // Filtros para pedidos
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroSucursal, setFiltroSucursal] = useState('todos');
  const [filtroFecha, setFiltroFecha] = useState('todos');

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
      // Add example orders for testing
      const exampleOrders = [
        {
          id: 'ejemplo1',
          cliente: { firstName: 'Juan', lastName: 'Pérez', email: 'juan@example.com' },
          total: 1500,
          estado: 'Pendiente',
          fecha: new Date().toISOString(),
          lugarRecogida: BRANCHES[0],
          productos: [
            { nombre: 'Maloobtal', cantidad: 2, precio: 850 },
            { nombre: 'RenNut', cantidad: 1, precio: 720, sabor: 'Vainilla' }
          ]
        },
        {
          id: 'ejemplo2',
          cliente: { firstName: 'Ana', lastName: 'López', email: 'ana@example.com' },
          total: 920,
          estado: 'En proceso',
          fecha: new Date().toISOString(),
          lugarRecogida: BRANCHES[1],
          productos: [
            { nombre: 'HemProt', cantidad: 1, precio: 920, sabor: 'Chocolate' }
          ]
        }
      ];
      setPedidos([...pedidosDB, ...exampleOrders]);
    };
  
    obtenerPedidos();
  }, []);

  // Initialize inventory for a branch
  const initializeInventory = async (branch) => {
    const inventarioRef = doc(db, 'inventario', branch);
    const inventarioSnap = await getDoc(inventarioRef);
    
    if (!inventarioSnap.exists()) {
      const initialInventory = {};
      Object.entries(products).forEach(([productId, product]) => {
        initialInventory[productId] = { stock: 0 };
        if (product.flavors) {
          initialInventory[productId].flavors = Object.fromEntries(product.flavors.map(f => [f.id, 0]));
        }
      });
      
      await setDoc(inventarioRef, initialInventory);
    }
  };

  // Initialize inventory for all branches
  useEffect(() => {
    const initAllBranches = async () => {
      for (const branch of BRANCHES) {
        await initializeInventory(branch);
      }
    };
    initAllBranches();
  }, []);

  // Cargar inventario de la sucursal seleccionada
  useEffect(() => {
    const cargarInventario = async () => {
      const inventarioRef = doc(db, 'inventario', selectedBranch);
      const inventarioSnap = await getDoc(inventarioRef);
      if (inventarioSnap.exists()) {
        setInventario(inventarioSnap.data());
      } else {
        // Si no existe, inicializa el inventario para esa sucursal
        const initialInventory = {};
        Object.entries(products).forEach(([productId, product]) => {
          initialInventory[productId] = { stock: 0 };
          if (product.flavors) {
            initialInventory[productId].flavors = Object.fromEntries(product.flavors.map(f => [f.id, 0]));
          }
        });
        await setDoc(inventarioRef, initialInventory);
        setInventario(initialInventory);
      }
    };
    cargarInventario();
  }, [selectedBranch]);

  const handleEstadoChange = async (id, nuevoEstado) => {
    const ref = doc(db, 'pedidos', id);
    await updateDoc(ref, { estado: nuevoEstado });
    setPedidos(pedidos.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
  };

  const handleInventarioChange = async (productId, flavorId, value) => {
    const newValue = Math.max(0, parseInt(value) || 0);
    const inventarioRef = doc(db, 'inventario', selectedBranch);

    // Defensive: ensure product exists in inventario
    const prevProduct = inventario[productId] || { stock: 0 };
    let newProduct;
    if (flavorId) {
      // Defensive: ensure flavors exists
      const prevFlavors = prevProduct.flavors || {};
      newProduct = {
        ...prevProduct,
        flavors: {
          ...prevFlavors,
          [flavorId]: newValue
        }
      };
    } else {
      newProduct = {
        ...prevProduct,
        stock: newValue
      };
    }

    const newInventario = {
      ...inventario,
      [productId]: newProduct
    };

    setInventario(newInventario);
    await updateDoc(inventarioRef, newInventario);
  };

  // Filtrar pedidos
  const pedidosFiltrados = pedidos.filter(pedido => {
    if (filtroEstado !== 'todos' && pedido.estado !== filtroEstado) return false;
    if (filtroSucursal !== 'todos' && pedido.lugarRecogida !== filtroSucursal) return false;
    if (filtroFecha !== 'todos') {
      const fechaPedido = new Date(pedido.fecha);
      const hoy = new Date();
      const ayer = new Date(hoy);
      ayer.setDate(ayer.getDate() - 1);
      
      if (filtroFecha === 'hoy' && fechaPedido.toDateString() !== hoy.toDateString()) return false;
      if (filtroFecha === 'ayer' && fechaPedido.toDateString() !== ayer.toDateString()) return false;
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#5773BB]">Dashboard Admin</h1>
        <button onClick={logout} className="bg-gray-200 px-4 py-2 rounded-lg">Cerrar sesión</button>
      </div>

      <div className="flex space-x-4 mb-8">
        <button
          className={`px-6 py-2 rounded-t-lg font-semibold transition-all duration-200 ${activeTab === 'pedidos' ? 'bg-[#5773BB] text-white shadow' : 'bg-gray-100 text-[#5773BB]'}`}
          onClick={() => setActiveTab('pedidos')}
        >
          Pedidos
        </button>
        <button
          className={`px-6 py-2 rounded-t-lg font-semibold transition-all duration-200 ${activeTab === 'inventory' ? 'bg-[#5773BB] text-white shadow' : 'bg-gray-100 text-[#5773BB]'}`}
          onClick={() => setActiveTab('inventory')}
        >
          Inventario
        </button>
      </div>

      {activeTab === 'pedidos' && (
        <div>
          <div className="flex flex-wrap gap-4 mb-6">
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="todos">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En proceso">En proceso</option>
              <option value="En camino">En camino</option>
              <option value="Entregado">Entregado</option>
            </select>

            <select
              value={filtroSucursal}
              onChange={(e) => setFiltroSucursal(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="todos">Todas las sucursales</option>
              {BRANCHES.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>

            <select
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="todos">Todas las fechas</option>
              <option value="hoy">Hoy</option>
              <option value="ayer">Ayer</option>
            </select>
          </div>

          <h2 className="text-xl font-semibold mb-4">Pedidos ({pedidosFiltrados.length})</h2>
          <table className="w-full bg-white rounded-xl shadow-md overflow-hidden">
            <thead>
              <tr className="bg-[#5773BB]/10 text-[#5773BB]">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Cliente</th>
                <th className="py-3 px-4 text-left">Total</th>
                <th className="py-3 px-4 text-left">Sucursal</th>
                <th className="py-3 px-4 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map(p => (
                <React.Fragment key={p.id}>
                  <tr
                    className="border-b last:border-none cursor-pointer hover:bg-gray-50"
                    onClick={() => setPedidoActivo(pedidoActivo?.id === p.id ? null : p)}
                  >
                    <td className="py-2 px-4">{p.id}</td>
                    <td className="py-2 px-4">{p.cliente?.firstName || ''} {p.cliente?.lastName || ''}</td>
                    <td className="py-2 px-4">MXN {p.total}</td>
                    <td className="py-2 px-4">{p.lugarRecogida}</td>
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
      )}

      {activeTab === 'inventory' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Inventario</h2>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-xs mt-2"
            >
              {BRANCHES.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(products).map(([productId, product]) => (
              <div key={productId} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 flex-shrink-0 mx-auto mb-2">
                  <img
                    src={product.flavors ? product.flavors[0].images[0] : product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-lg bg-gray-50"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                {product.flavors ? (
                  <div className="mt-2 w-full flex flex-col gap-2">
                    {product.flavors.map(flavor => (
                      <div key={flavor.id} className="flex items-center justify-between w-full">
                        <span className="text-sm font-medium text-gray-700 text-left">{flavor.name.es}</span>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            className="md:hidden px-2 py-1 rounded bg-gray-200 text-[#5773BB] font-bold"
                            onClick={() => handleInventarioChange(productId, flavor.id, Math.max(0, (inventario[productId]?.flavors?.[flavor.id] ?? 0) - 1))}
                          >-</button>
                          <input
                            type="number"
                            min="0"
                            value={inventario[productId]?.flavors?.[flavor.id] ?? 0}
                            onChange={(e) => handleInventarioChange(productId, flavor.id, e.target.value)}
                            className="w-20 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-[#5773BB] focus:border-transparent text-center"
                          />
                          <button
                            type="button"
                            className="md:hidden px-2 py-1 rounded bg-gray-200 text-[#5773BB] font-bold"
                            onClick={() => handleInventarioChange(productId, flavor.id, (inventario[productId]?.flavors?.[flavor.id] ?? 0) + 1)}
                          >+</button>
                          <span className="text-sm text-gray-500">unidades</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 flex items-center justify-center w-full">
                    <span className="text-sm font-medium text-gray-700">Stock</span>
                    <button
                      type="button"
                      className="md:hidden px-2 py-1 rounded bg-gray-200 text-[#5773BB] font-bold mx-1"
                      onClick={() => handleInventarioChange(productId, null, Math.max(0, (inventario[productId]?.stock ?? 0) - 1))}
                    >-</button>
                    <input
                      type="number"
                      min="0"
                      value={inventario[productId]?.stock ?? 0}
                      onChange={(e) => handleInventarioChange(productId, null, e.target.value)}
                      className="w-20 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-[#5773BB] focus:border-transparent mx-2 text-center"
                    />
                    <button
                      type="button"
                      className="md:hidden px-2 py-1 rounded bg-gray-200 text-[#5773BB] font-bold mx-1"
                      onClick={() => handleInventarioChange(productId, null, (inventario[productId]?.stock ?? 0) + 1)}
                    >+</button>
                    <span className="text-sm text-gray-500">unidades</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
