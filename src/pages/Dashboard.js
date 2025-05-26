import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, getDoc, setDoc, query, where, addDoc } from 'firebase/firestore';
import { products as storeProducts } from '../data/products';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaChartLine, FaHistory, FaPlus, FaFileExport } from 'react-icons/fa';

const BRANCHES = [
  'Renal Clínica',
  'Star Médica, Col. Altabrisa',
  'Cenit Medical Center'
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inventory');
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState(null);
  const [inventory, setInventory] = useState({});
  const [quantityToAdd, setQuantityToAdd] = useState({});

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      await fetchData();
    };
    checkAuth();
  }, [user, navigate, selectedDate, selectedBranch]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Convert store products to array format
      const productsData = Object.entries(storeProducts).map(([id, product]) => ({
        id,
        ...product,
        price: parseFloat(product.price.replace('$', '').replace(',', ''))
      }));
      setProducts(productsData);

      // Fetch inventory for selected branch
      const inventoryRef = doc(db, 'inventario', selectedBranch);
      const inventorySnap = await getDoc(inventoryRef);
      if (inventorySnap.exists()) {
        setInventory(inventorySnap.data());
      } else {
        // Initialize inventory for this branch if it doesn't exist
        const initialInventory = {};
        productsData.forEach(product => {
          initialInventory[product.id] = {
            stock: 0,
            name: product.name,
            price: product.price
          };
        });
        await setDoc(inventoryRef, initialInventory);
        setInventory(initialInventory);
      }

      // Fetch sales for selected date and branch
      const salesRef = collection(db, 'ventas');
      const salesQuery = query(
        salesRef,
        where('fecha', '==', selectedDate),
        where('sucursal', '==', selectedBranch)
      );
      const salesSnapshot = await getDocs(salesQuery);
      const salesData = salesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSales(salesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error al cargar los datos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const updateInventory = async (productId, quantity) => {
    try {
      setError(null);
      const inventoryRef = doc(db, 'inventario', selectedBranch);
      const currentStock = inventory[productId]?.stock || 0;
      const newStock = currentStock + quantity;

      const newInventory = {
        ...inventory,
        [productId]: {
          ...inventory[productId],
          stock: newStock
        }
      };
      await updateDoc(inventoryRef, newInventory);
      setInventory(newInventory);
      setQuantityToAdd({ ...quantityToAdd, [productId]: '' });
    } catch (error) {
      console.error('Error updating inventory:', error);
      setError('Error al actualizar el inventario. Por favor, intenta de nuevo.');
    }
  };

  const addSale = async (productId, quantity) => {
    try {
      setError(null);
      const product = products.find(p => p.id === productId);
      const currentStock = inventory[productId]?.stock || 0;

      if (!product) {
        throw new Error('Producto no encontrado');
      }

      if (currentStock < quantity) {
        throw new Error('Stock insuficiente');
      }

      // Add sale record
      const salesRef = collection(db, 'ventas');
      await addDoc(salesRef, {
        productoId: productId,
        cantidad: quantity,
        fecha: selectedDate,
        timestamp: new Date().toISOString(),
        precio: product.price,
        total: product.price * quantity,
        sucursal: selectedBranch,
        productoNombre: product.name
      });

      // Update inventory
      await updateInventory(productId, -quantity);
      await fetchData(); // Refresh data
    } catch (error) {
      console.error('Error adding sale:', error);
      setError(error.message || 'Error al registrar la venta. Por favor, intenta de nuevo.');
    }
  };

  const exportToCSV = (data, filename) => {
    if (!data.length) return;
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).join(','));
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportInventory = () => {
    const inventoryData = products.map(product => ({
      'ID': product.id,
      'Nombre': product.name,
      'Stock': inventory[product.id]?.stock || 0,
      'Precio': product.price || 0,
      'Descripción': product.description?.es || '',
      'Sucursal': selectedBranch
    }));
    exportToCSV(inventoryData, `inventario_${selectedBranch}_${selectedDate}.csv`);
  };

  const exportSales = () => {
    const salesData = sales.map(sale => ({
      'ID': sale.id,
      'Producto': sale.productoNombre || 'No encontrado',
      'Cantidad': sale.cantidad,
      'Precio Unitario': sale.precio || 0,
      'Total': sale.total || 0,
      'Fecha': sale.fecha,
      'Hora': new Date(sale.timestamp).toLocaleTimeString(),
      'Sucursal': sale.sucursal
    }));
    exportToCSV(salesData, `ventas_${selectedBranch}_${selectedDate}.csv`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5773BB]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchData}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#5773BB]">Panel de Administración</h1>
          <div className="flex items-center gap-4">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              {BRANCHES.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            />
            <button
              onClick={activeTab === 'inventory' ? exportInventory : exportSales}
              className="bg-[#5773BB] text-white px-4 py-2 rounded-lg hover:bg-[#4466B7] transition-colors flex items-center gap-2"
            >
              <FaFileExport />
              Exportar {activeTab === 'inventory' ? 'Inventario' : 'Ventas'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#5773BB]/10 p-3 rounded-lg">
                <FaBox className="text-[#5773BB] text-2xl" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Total Productos</h3>
                <p className="text-2xl font-bold text-[#5773BB]">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#00BFB3]/10 p-3 rounded-lg">
                <FaChartLine className="text-[#00BFB3] text-2xl" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Ventas Hoy</h3>
                <p className="text-2xl font-bold text-[#00BFB3]">
                  {sales.reduce((sum, sale) => sum + sale.cantidad, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#FF6B6B]/10 p-3 rounded-lg">
                <FaHistory className="text-[#FF6B6B] text-2xl" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Productos Bajos en Stock</h3>
                <p className="text-2xl font-bold text-[#FF6B6B]">
                  {Object.values(inventory).filter(item => (item.stock || 0) < 10).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mini Navbar */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex-1 py-4 px-6 text-center font-semibold ${
                activeTab === 'inventory'
                  ? 'text-[#5773BB] border-b-2 border-[#5773BB]'
                  : 'text-gray-500 hover:text-[#5773BB]'
              }`}
            >
              <FaBox className="inline-block mr-2" />
              Inventario
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`flex-1 py-4 px-6 text-center font-semibold ${
                activeTab === 'sales'
                  ? 'text-[#5773BB] border-b-2 border-[#5773BB]'
                  : 'text-gray-500 hover:text-[#5773BB]'
              }`}
            >
              <FaChartLine className="inline-block mr-2" />
              Ventas
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          {activeTab === 'inventory' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6">Producto</th>
                    <th className="text-left py-4 px-6">Stock Actual</th>
                    <th className="text-left py-4 px-6">Precio</th>
                    <th className="text-left py-4 px-6">Agregar Stock</th>
                    <th className="text-left py-4 px-6">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {product.images && product.images[0] && (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                          )}
                          <span>{product.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold">{inventory[product.id]?.stock || 0}</span>
                      </td>
                      <td className="py-4 px-6">
                        ${product.price || 0}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={quantityToAdd[product.id] || ''}
                            onChange={(e) => setQuantityToAdd({ ...quantityToAdd, [product.id]: e.target.value })}
                            placeholder="Cantidad"
                            className="border border-gray-300 rounded-lg px-3 py-1 w-20"
                            min="1"
                          />
                          <button
                            onClick={() => updateInventory(product.id, parseInt(quantityToAdd[product.id] || 0))}
                            className="bg-[#00BFB3] text-white px-3 py-1 rounded-lg hover:bg-[#00A89D] transition-colors"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => addSale(product.id, 1)}
                          disabled={!inventory[product.id]?.stock}
                          className={`px-3 py-1 rounded-lg transition-colors ${
                            inventory[product.id]?.stock
                              ? 'bg-[#00BFB3] text-white hover:bg-[#00A89D]'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Registrar Venta
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6">Producto</th>
                    <th className="text-left py-4 px-6">Cantidad</th>
                    <th className="text-left py-4 px-6">Precio Unitario</th>
                    <th className="text-left py-4 px-6">Total</th>
                    <th className="text-left py-4 px-6">Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.id} className="border-b border-gray-100">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {sale.productoNombre}
                        </div>
                      </td>
                      <td className="py-4 px-6">{sale.cantidad}</td>
                      <td className="py-4 px-6">${sale.precio || 0}</td>
                      <td className="py-4 px-6">${sale.total || 0}</td>
                      <td className="py-4 px-6">
                        {new Date(sale.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
