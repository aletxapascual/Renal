import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useLoginModal } from './LoginModalContext';
import { useCart } from './CartContext';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const { openLoginModal, closeLoginModal } = useLoginModal();
  const { clearCart } = useCart();

  const login = (userData) => {
    setUser(userData);
    closeLoginModal();
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      clearCart();
      openLoginModal();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const ref = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(ref);
          let data = snap.exists() ? snap.data() : {};

          // Si no existe, crear el documento con nombre y apellido de Google
          if (!snap.exists()) {
            const [firstName, ...lastNameParts] = (firebaseUser.displayName || '').split(' ');
            const lastName = lastNameParts.join(' ');
            data = {
              firstName: firstName || '',
              lastName: lastName || '',
              email: firebaseUser.email,
              role: 'cliente',
            };
            await setDoc(ref, data);
          } else {
            // Si existe pero le falta nombre o apellido, actualiza
            if ((!data.firstName || !data.lastName) && firebaseUser.displayName) {
              const [firstName, ...lastNameParts] = (firebaseUser.displayName || '').split(' ');
              const lastName = lastNameParts.join(' ');
              data.firstName = data.firstName || firstName || '';
              data.lastName = data.lastName || lastName || '';
              await setDoc(ref, data, { merge: true });
            }
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            role: data.role || 'cliente',
          });

        } catch (err) {
          console.error('Error al cargar datos del usuario:', err);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            firstName: '',
            lastName: '',
            role: 'cliente',
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
