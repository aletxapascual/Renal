import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, getDoc, setDoc, query, where, addDoc } from 'firebase/firestore';
import { products as storeProducts } from '../data/products';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaChartLine, FaHistory, FaPlus } from 'react-icons/fa';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

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
  const [saleCart, setSaleCart] = useState([]);
  const [salesPage, setSalesPage] = useState(1);
  const salesPerPage = 10;
  const paginatedSales = sales.slice((salesPage-1)*salesPerPage, salesPage*salesPerPage);
  const totalSalesPages = Math.ceil(sales.length / salesPerPage);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const salesThisMonth = sales.filter(sale => (sale.fecha || '').startsWith(selectedMonth));

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
      console.log('Sucursal seleccionada:', selectedBranch);
      if (inventorySnap.exists()) {
        console.log('Inventario obtenido de Firestore:', inventorySnap.data());
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
        console.log('Inventario inicializado en Firestore:', initialInventory);
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

  const addProductToSaleCart = () => {
    if (!selectedProductId || !saleQuantity || parseInt(saleQuantity) <= 0) return;
    let product = products.find(p => p.id === selectedProductId);
    let name = product.name;
    let flavor = null;
    let flavorId = null;
    if (product.flavors && selectedFlavorId) {
      const flavorObj = product.flavors.find(f => f.id === selectedFlavorId);
      name = `${product.name} ${flavorObj.name.es}`;
      flavor = flavorObj.name.es;
      flavorId = `${selectedProductId}_${selectedFlavorId}`;
    }
    const id = flavorId || selectedProductId;
    setSaleCart([...saleCart, {
      id,
      name,
      quantity: parseInt(saleQuantity),
      price: product.price,
      flavor
    }]);
    setSelectedProductId('');
    setSelectedFlavorId('');
    setSaleQuantity('');
  };

  const removeFromSaleCart = (idx) => {
    setSaleCart(saleCart.filter((_, i) => i !== idx));
  };

  const registerSale = async () => {
    try {
      setError(null);
      if (saleCart.length === 0) throw new Error('Agrega al menos un producto');
      // Verificar stock suficiente para todos
      for (const item of saleCart) {
        const currentStock = inventory[item.id]?.stock || 0;
        if (currentStock < item.quantity) {
          throw new Error(`Stock insuficiente para ${item.name}`);
        }
      }
      // Registrar venta en Firestore
      const salesRef = collection(db, 'ventas');
      const total = saleCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      await addDoc(salesRef, {
        productos: saleCart,
        total,
        fecha: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        sucursal: selectedBranch
      });
      // Descontar stock de todos los productos (uno por uno, espera cada update antes de seguir)
      for (const item of saleCart) {
        await updateInventory(item.id, -item.quantity);
      }
      setSaleCart([]);
      await fetchData();
    } catch (error) {
      setError(error.message || 'Error al registrar la venta.');
    }
  };

  // Calcular productos vendidos en el mes actual
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7); // 'YYYY-MM'
  const productSalesMap = {};
  const productEarningsMap = {};
  salesThisMonth.forEach(sale => {
    (sale.productos || []).forEach(item => {
      if (!productSalesMap[item.name]) productSalesMap[item.name] = 0;
      if (!productEarningsMap[item.name]) productEarningsMap[item.name] = 0;
      productSalesMap[item.name] += item.quantity;
      productEarningsMap[item.name] += item.quantity * item.price;
    });
  });
  const productSalesArray = Object.entries(productSalesMap).map(([name, quantity]) => ({ name, quantity, earnings: productEarningsMap[name] }));
  const totalEarnings = productSalesArray.reduce((sum, p) => sum + p.earnings, 0);

  // Colores para productos
  const chartColors = [
    '#5773BB', '#F6C85F', '#6FB07F', '#ED6A5A', '#9D79BC', '#4D9078', '#FFB85F', '#BFD7EA', '#FF6F61', '#5F4B8B'
  ];

  const doughnutData = {
    labels: productSalesArray.map(p => p.name),
    datasets: [
      {
        data: productSalesArray.map(p => p.earnings),
        backgroundColor: chartColors.slice(0, productSalesArray.length),
        borderWidth: 2,
      },
    ],
  };
  const doughnutOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            const idx = context.dataIndex;
            const prod = productSalesArray[idx];
            return `${prod.name}: ${prod.quantity} vendidos ($${prod.earnings.toLocaleString('en-US', {minimumFractionDigits: 2})})`;
          }
        }
      },
      title: { display: false }
    },
    cutout: '70%',
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
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <div className="text-lg sm:text-xl font-semibold text-gray-700 text-center sm:text-left">
            Sucursal: <span className="text-[#00BFB3] font-bold">{selectedBranch}</span>
          </div>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-auto"
          >
            {BRANCHES.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
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

        <div className="bg-white rounded-xl shadow-sm p-2 sm:p-6 overflow-x-auto">
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
                                    alt={`${product.name} ${flavor.name.es}`}
                                    className="w-10 h-10 object-cover rounded-lg"
                                  />
                                )}
                                <span>{product.name} {flavor.name.es}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-center">{inventory[flavorId]?.stock || 0}</td>
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
                                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                  +
                                </button>
                                <button
                                  onClick={() => updateInventory(flavorId, -parseInt(quantityToAdd[flavorId] || 0))}
                                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                  -
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
                          <td className="py-4 px-6 text-center">{inventory[product.id]?.stock || 0}</td>
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
                                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors"
                              >
                                +
                              </button>
                              <button
                                onClick={() => updateInventory(product.id, -parseInt(quantityToAdd[product.id] || 0))}
                                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors"
                              >
                                -
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
                    <th className="text-left py-4 px-6">Productos</th>
                    <th className="text-left py-4 px-6">Total</th>
                    <th className="text-left py-4 px-6">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSales.map((sale) => (
                    <tr key={sale.id} className="border-b border-gray-100">
                      <td className="py-4 px-6">
                        <ul>
                          {(sale.productos || []).map((item, idx) => (
                            <li key={idx}>
                              {item.name} x {item.quantity}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-4 px-6">${sale.total || 0}</td>
                      <td className="py-4 px-6">{sale.fecha ? sale.fecha : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Registrar Nueva Venta</h3>
                <div className="flex flex-wrap gap-4 items-end">
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
                    onClick={addProductToSaleCart}
                    className="bg-[#00BFB3] text-white px-4 py-2 rounded-lg hover:bg-[#00A89D] transition-colors"
                  >
                    +
                  </button>
                </div>
                {saleCart.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Productos a vender:</h4>
                    <ul className="mb-2">
                      {saleCart.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 mb-1">
                          <span>{item.name} x {item.quantity} (${item.price * item.quantity})</span>
                          <button onClick={() => removeFromSaleCart(idx)} className="text-red-500 hover:underline">Quitar</button>
                        </li>
                      ))}
                    </ul>
                    <div className="font-bold mb-2">Total: ${saleCart.reduce((sum, item) => sum + item.price * item.quantity, 0)}</div>
                    <button
                      onClick={registerSale}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Registrar Venta
                    </button>
                  </div>
                )}
                {error && (
                  <div className="mt-2 text-red-600 font-semibold text-center">{error}</div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Resumen de productos vendidos este mes */}
        {activeTab === 'sales' && (
          <div className="mt-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <label className="font-semibold">Mes:
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={e => { setSelectedMonth(e.target.value); setSalesPage(1); }}
                  className="ml-2 border border-gray-300 rounded-lg px-2 py-1"
                />
              </label>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-4 text-green-600 text-center">Productos vendidos este mes</h3>
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1">
                <ul className="mb-6">
                  {productSalesArray.length === 0 && <li>No hay ventas este mes.</li>}
                  {productSalesArray.map((prod, idx) => (
                    <li key={idx} className="mb-1 flex items-center gap-2">
                      <span style={{display:'inline-block',width:14,height:14,background:chartColors[idx],borderRadius:3}}></span>
                      {prod.name}: <span className="font-bold">{prod.quantity}</span> vendidos <span className="text-gray-500">(${prod.earnings.toLocaleString('en-US', {minimumFractionDigits:2})})</span>
                    </li>
                  ))}
                </ul>
              </div>
              {productSalesArray.length > 0 && (
                <div className="relative flex-1 max-w-xs mx-auto">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="text-lg font-bold text-[#5773BB] text-center">Ganancia total</div>
                    <div className="text-2xl font-extrabold text-[#5773BB] text-center">${totalEarnings.toLocaleString('en-US', {minimumFractionDigits:2})}</div>
                  </div>
                </div>
              )}
            </div>
            {/* Paginación */}
            {totalSalesPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  onClick={() => setSalesPage(p => Math.max(1, p-1))}
                  disabled={salesPage === 1}
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >Anterior</button>
                <span className="font-semibold">Página {salesPage} de {totalSalesPages}</span>
                <button
                  onClick={() => setSalesPage(p => Math.min(totalSalesPages, p+1))}
                  disabled={salesPage === totalSalesPages}
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >Siguiente</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
