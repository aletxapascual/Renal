const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyDM4euL666ZlgnYabzJeqDjZyMisuHgYd8",
    authDomain: "renal-c6452.firebaseapp.com",
    projectId: "renal-c6452",
    storageBucket: "renal-c6452.firebasestorage.app",
    messagingSenderId: "843927060911",
    appId: "1:843927060911:web:d17390a1418c287d63af5a",
    measurementId: "G-QYX8EJRRZ4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const BRANCHES = [
  'Renal Clínica',
  'Star Médica, Col. Altabrisa',
  'Cenit Medical Center'
];

async function clearAllData() {
  try {
    console.log('🧹 Iniciando limpieza de datos de Firebase...');
    
    // 1. Limpiar todas las ventas
    console.log('📊 Limpiando colección de ventas...');
    const ventasRef = collection(db, 'ventas');
    const ventasSnapshot = await getDocs(ventasRef);
    const ventasDeletePromises = ventasSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(ventasDeletePromises);
    console.log(`✅ Se eliminaron ${ventasSnapshot.size} registros de ventas`);
    
    // 2. Limpiar todos los pedidos
    console.log('📦 Limpiando colección de pedidos...');
    const pedidosRef = collection(db, 'pedidos');
    const pedidosSnapshot = await getDocs(pedidosRef);
    const pedidosDeletePromises = pedidosSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(pedidosDeletePromises);
    console.log(`✅ Se eliminaron ${pedidosSnapshot.size} registros de pedidos`);
    
    // 3. Limpiar inventario de todas las sucursales
    console.log('📋 Limpiando inventario de todas las sucursales...');
    for (const branch of BRANCHES) {
      const inventarioRef = doc(db, 'inventario', branch);
      await updateDoc(inventarioRef, {
        hemprot: { stock: 0 },
        rennut: { stock: 0 },
        maloobtal: { stock: 0 },
        maloobtalPro: { stock: 0 },
        hemprot_chocolate: { stock: 0 },
        hemprot_vainilla: { stock: 0 },
        hemprot_fresa: { stock: 0 },
        rennut_chocolate: { stock: 0 },
        rennut_vainilla: { stock: 0 },
        rennut_fresa: { stock: 0 }
      });
      console.log(`✅ Inventario de ${branch} reseteado a 0`);
    }
    
    console.log('🎉 ¡Limpieza completada exitosamente!');
    console.log('📝 Resumen:');
    console.log(`   - ${ventasSnapshot.size} ventas eliminadas`);
    console.log(`   - ${pedidosSnapshot.size} pedidos eliminados`);
    console.log(`   - Inventario de ${BRANCHES.length} sucursales reseteado`);
    console.log('🚀 El sistema está listo para comenzar a usar desde cero.');
    
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
  }
}

// Ejecutar la limpieza
clearAllData(); 