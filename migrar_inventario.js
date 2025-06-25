const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, updateDoc, deleteField } = require('firebase/firestore');

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

async function migrateBranch(branch) {
  const ref = doc(db, 'inventario', branch);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    return;
  }
  const data = snap.data();
  const updates = {};
  // Migrar HemProt
  if (data.hemprot && data.hemprot.flavors) {
    for (const [flavor, stock] of Object.entries(data.hemprot.flavors)) {
      updates[`hemprot_${flavor}`] = { stock };
    }
    updates['hemprot'] = deleteField();
  }
  // Migrar RenNut
  if (data.rennut && data.rennut.flavors) {
    for (const [flavor, stock] of Object.entries(data.rennut.flavors)) {
      updates[`rennut_${flavor}`] = { stock };
    }
    updates['rennut'] = deleteField();
  }
  // Limpiar updates de valores undefined
  Object.keys(updates).forEach(key => {
    if (updates[key] === undefined) {
      delete updates[key];
    }
  });
  // Ejecutar update solo si hay cambios
  if (Object.keys(updates).length > 0) {
    await updateDoc(ref, updates);
  }
}

async function main() {
  for (const branch of BRANCHES) {
    try {
      await migrateBranch(branch);
    } catch (e) {
      console.error(`Error migrando ${branch}:`, e);
    }
  }
  process.exit(0);
}

main(); 