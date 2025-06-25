// Script para migrar la estructura de inventario en Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

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
  let changed = false;
  const updates = { ...data };

  // Migrar HemProt
  if (data.hemprot && data.hemprot.flavors) {
    for (const [flavor, stock] of Object.entries(data.hemprot.flavors)) {
      updates[`hemprot_${flavor}`] = { stock };
    }
    delete updates.hemprot;
    changed = true;
  }
  // Migrar RenNut
  if (data.rennut && data.rennut.flavors) {
    for (const [flavor, stock] of Object.entries(data.rennut.flavors)) {
      updates[`rennut_${flavor}`] = { stock };
    }
    delete updates.rennut;
    changed = true;
  }
  // Eliminar stock general si existe
  if (updates.hemprot && updates.hemprot.stock !== undefined) {
    delete updates.hemprot;
    changed = true;
  }
  if (updates.rennut && updates.rennut.stock !== undefined) {
    delete updates.rennut;
    changed = true;
  }
  if (changed) {
    await updateDoc(ref, updates);
  }
}

async function main() {
  for (const branch of BRANCHES) {
    await migrateBranch(branch);
  }
}

main().catch(e => {
  console.error('Error en la migración:', e);
}); 