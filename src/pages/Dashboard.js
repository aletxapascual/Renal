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
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedFlavorId, setSelectedFlavorId] = useState('');
  const [saleQuantity, setSaleQuantity] = useState('');

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

      // Fetch all sales for the selected branch
      const salesRef = collection(db, 'ventas');
      const salesQuery = query(
        salesRef,
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
            <button
              onClick={activeTab === 'inventory' ? exportInventory : exportSales}
              className="bg-[#5773BB] text-white px-4 py-2 rounded-lg hover:bg-[#4466B7] transition-colors flex items-center gap-2"
            >
              <FaFileExport />
              Exportar {activeTab === 'inventory' ? 'Inventario' : 'Ventas'}
            </button>
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
                    <th className="text-left py-4 px-6">Agregar Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.flatMap((product) => {
                    if (product.flavors && Array.isArray(product.flavors)) {
                      // Para productos con sabores (HemProt, RenNut)
                      return product.flavors.map((flavor) => {
                        const flavorId = `${product.id}_${flavor.id}`;
                        return (
                          <tr key={flavorId} className="border-b border-gray-100">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                {flavor.images && flavor.images[0] && (
                                  <img
                                    src={flavor.images[0]}
                                    alt={`${product.name} - ${flavor.name.es}`}
                                    className="w-10 h-10 object-cover rounded-lg"
                                  />
                                )}
                                <span>{product.name} - {flavor.name.es}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">{inventory[flavorId]?.stock || 0}</td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={quantityToAdd[flavorId] || ''}
                                  onChange={(e) => setQuantityToAdd({ ...quantityToAdd, [flavorId]: e.target.value })}
                                  placeholder="Cantidad"
                                  className="border border-gray-300 rounded-lg px-3 py-1 w-20"
                                  min="1"
                                />
                                <button
                                  onClick={() => updateInventory(flavorId, parseInt(quantityToAdd[flavorId] || 0))}
                                  className="bg-[#00BFB3] text-white px-3 py-1 rounded-lg hover:bg-[#00A89D] transition-colors"
                                >
                                  <FaPlus />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      });
                    } else {
                      // Productos normales
                      return (
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
                          <td className="py-4 px-6">{inventory[product.id]?.stock || 0}</td>
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
                        </tr>
                      );
                    }
                  })}
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
                      <td className="py-4 px-6">${sale.total || 0}</td>
                      <td className="py-4 px-6">
                        {new Date(sale.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Registrar Nueva Venta</h3>
                <div className="flex flex-wrap gap-4">
                  <select
                    value={selectedProductId || ''}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="">Seleccionar Producto</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  {selectedProductId && products.find(p => p.id === selectedProductId)?.flavors && (
                    <select
                      value={selectedFlavorId || ''}
                      onChange={(e) => setSelectedFlavorId(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                    >
                      <option value="">Seleccionar Sabor</option>
                      {products.find(p => p.id === selectedProductId).flavors.map((flavor) => (
                        <option key={flavor.id} value={flavor.id}>
                          {flavor.name.es}
                        </option>
                      ))}
                    </select>
                  )}
                  <input
                    type="number"
                    value={saleQuantity || ''}
                    onChange={(e) => setSaleQuantity(e.target.value)}
                    placeholder="Cantidad"
                    className="border border-gray-300 rounded-lg px-4 py-2 w-20"
                    min="1"
                  />
                  <button
                    onClick={() => {
                      if (selectedProductId && selectedFlavorId) {
                        const flavorId = `${selectedProductId}_${selectedFlavorId}`;
                        addSale(flavorId, parseInt(saleQuantity || 0));
                      } else {
                        addSale(selectedProductId, parseInt(saleQuantity || 0));
                      }
                    }}
                    className="bg-[#00BFB3] text-white px-4 py-2 rounded-lg hover:bg-[#00A89D] transition-colors"
                  >
                    Registrar Venta
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
