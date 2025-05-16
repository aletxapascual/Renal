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
          // Intentar obtener datos de la colección 'users' primero
          let userRef = doc(db, 'users', firebaseUser.uid);
          let userSnap = await getDoc(userRef);
          let userData = userSnap.exists() ? userSnap.data() : null;

          // Si no existe en 'users', intentar en 'usuarios'
          if (!userData) {
            userRef = doc(db, 'usuarios', firebaseUser.uid);
            userSnap = await getDoc(userRef);
            userData = userSnap.exists() ? userSnap.data() : null;
          }

          // Si no existe en ninguna colección, crear en 'users'
          if (!userData) {
            const [firstName, ...lastNameParts] = (firebaseUser.displayName || '').split(' ');
            const lastName = lastNameParts.join(' ');
            userData = {
              firstName: firstName || '',
              lastName: lastName || '',
              email: firebaseUser.email,
              role: 'cliente',
              createdAt: new Date().toISOString()
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), userData);
          }

          // Actualizar el estado del usuario
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            role: userData.role || 'cliente'
          });

        } catch (err) {
          console.error('Error al cargar datos del usuario:', err);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            firstName: '',
            lastName: '',
            role: 'cliente'
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
