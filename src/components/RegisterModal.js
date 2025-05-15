import React, { useState } from 'react';
import { useLoginModal } from '../context/LoginModalContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import logo from '../images/logo.png';

export default function RegisterModal() {
  const { modalType, closeLoginModal, openLoginModal } = useLoginModal();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (modalType !== 'register') return null;

  const handleClose = () => {
    closeLoginModal();
    openLoginModal();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogle = async () => {
    setError('');
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const uid = result.user.uid;
      const email = result.user.email || 'cliente_google';
      
      // Crear documento del usuario en Firestore
      await setDoc(doc(db, 'users', uid), {
        email,
        firstName: '',
        lastName: '',
        role: 'cliente',
        createdAt: new Date().toISOString()
      });

      login({ uid, email, firstName: '', lastName: '', role: 'cliente' });
      closeLoginModal();
      navigate('/usuario');
    } catch (err) {
      console.error(err);
      setError('No se pudo registrar con Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validaciones
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor completa todos los campos.');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const uid = userCredential.user.uid;

      // Crear documento del usuario en Firestore
      await setDoc(doc(db, 'users', uid), {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: 'cliente',
        createdAt: new Date().toISOString()
      });

      login({ 
        uid, 
        email: formData.email, 
        firstName: formData.firstName, 
        lastName: formData.lastName, 
        role: 'cliente' 
      });
      
      closeLoginModal();
      navigate('/usuario');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo ya está registrado.');
      } else {
        setError('Error al crear la cuenta.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40">
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-fadeIn">
        <button
          className="absolute top-4 left-4 text-2xl text-gray-400 hover:text-gray-700"
          onClick={handleClose}
          aria-label="Cerrar"
        >
          &times;
        </button>
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Renal Logo" className="h-24 w-auto object-contain mb-4" />
          <h2 className="text-2xl font-bold text-center mb-2 text-blue-600">Crea tu cuenta</h2>
        </div>
        <button
          className="w-full border border-blue-600 text-blue-600 rounded-full py-3 flex items-center justify-center gap-3 font-semibold mb-4 hover:bg-blue-600 hover:text-white transition-all duration-300 disabled:opacity-50"
          onClick={handleGoogle}
          disabled={isLoading}
        >
          <FaGoogle className="text-xl" />
          CONTINUAR CON GOOGLE
        </button>
        <p className="text-xs text-center text-gray-500 mb-6">
          Al registrarte, aceptas nuestra <a href="/privacy-policy" className="text-blue-600 hover:underline">Política de Privacidad</a>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="Nombre"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-full px-4 py-3 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all duration-300"
              disabled={isLoading}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Apellido"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-full px-4 py-3 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all duration-300"
              disabled={isLoading}
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-full px-4 py-3 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all duration-300"
            disabled={isLoading}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-full px-4 py-3 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all duration-300"
            disabled={isLoading}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-full px-4 py-3 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all duration-300"
            disabled={isLoading}
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {isLoading && <div className="text-gray-500 text-sm text-center">Cargando...</div>}
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-full mt-2 hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
            disabled={isLoading}
          >
            REGISTRARSE
          </button>
        </form>
        <div className="text-center mt-6 text-sm">
          ¿Ya tienes cuenta? <button onClick={handleClose} className="text-blue-600 font-semibold hover:underline">Iniciar sesión</button>
        </div>
      </div>
    </div>
  );
} 